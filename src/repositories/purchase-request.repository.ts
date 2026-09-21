import { db } from '../config/database.js';
import type {
  CreatePurchaseRequestRequest,
  PurchaseRequest,
  PurchaseRequestFilter,
  PurchaseRequestItem,
  PurchaseRequestListResponse,
  PurchaseRequestStatus,
  UpdatePurchaseRequestRequest,
} from '../types/purchase-request.js';

export const createPurchaseRequest = async (
  requestNumber: string,
  requestedBy: number,
  data: CreatePurchaseRequestRequest
): Promise<PurchaseRequest> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `
        INSERT INTO purchase_requests (
          request_number,
          warehouse_id,
          requested_by,
          status
        )
        VALUES (?, ?, ?, 'DRAFT')
      `,
      [
        requestNumber,
        data.warehouse_id,
        requestedBy,
      ]
    );

    const purchaseRequestId = (
      result as { insertId: number }
    ).insertId;

    for (const item of data.items) {
      await connection.execute(
        `
          INSERT INTO purchase_request_items (
            purchase_request_id,
            product_id,
            quantity
          )
          VALUES (?, ?, ?)
        `,
        [
          purchaseRequestId,
          item.product_id,
          item.quantity,
        ]
      );
    }

    await connection.commit();

    const purchaseRequest = await getPurchaseRequestById(
      purchaseRequestId
    );

    return purchaseRequest!;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const getPurchaseRequestById = async (
  id: number
): Promise<PurchaseRequest | null> => {
  const [requestRows] = await db.execute(
    `
      SELECT *
      FROM purchase_requests
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  const requests = requestRows as Omit<
    PurchaseRequest,
    'items'
  >[];

  const request = requests[0];

  if (!request) {
    return null;
  }

  const [itemRows] = await db.execute(
    `
      SELECT *
      FROM purchase_request_items
      WHERE purchase_request_id = ?
      ORDER BY id ASC
    `,
    [id]
  );

  return {
    ...request,
    items: itemRows as PurchaseRequestItem[],
  };
};

export const getPurchaseRequestsByCursor = async (
  filter: PurchaseRequestFilter
): Promise<PurchaseRequestListResponse> => {
  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (filter.status !== undefined) {
    conditions.push('status = ?');
    values.push(filter.status);
  }

  if (filter.requested_by !== undefined) {
    conditions.push('requested_by = ?');
    values.push(filter.requested_by);
  }

  if (filter.cursor !== undefined) {
    conditions.push('id < ?');
    values.push(filter.cursor);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

  const limit = filter.limit ?? 10;

  const [rows] = await db.execute(
    `
      SELECT *
      FROM purchase_requests
      ${whereClause}
      ORDER BY id DESC
      LIMIT ?
    `,
    [...values, limit]
  );

  const requests = rows as Omit<
    PurchaseRequest,
    'items'
  >[];

  const data: PurchaseRequest[] = [];

  for (const request of requests) {
    const [itemRows] = await db.execute(
      `
        SELECT *
        FROM purchase_request_items
        WHERE purchase_request_id = ?
        ORDER BY id ASC
      `,
      [request.id]
    );

    data.push({
      ...request,
      items: itemRows as PurchaseRequestItem[],
    });
  }

  return {
    data,
    pagination: {
      limit,
      next_cursor:
        data.length === limit
          ? data[data.length - 1].id
          : null,
    },
  };
};

export const updatePurchaseRequest = async (
  id: number,
  data: UpdatePurchaseRequestRequest
): Promise<PurchaseRequest | null> => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    if (data.warehouse_id !== undefined) {
      await connection.execute(
        `
          UPDATE purchase_requests
          SET warehouse_id = ?
          WHERE id = ?
        `,
        [data.warehouse_id, id]
      );
    }

    if (data.items !== undefined) {
      await connection.execute(
        `
          DELETE FROM purchase_request_items
          WHERE purchase_request_id = ?
        `,
        [id]
      );

      for (const item of data.items) {
        await connection.execute(
          `
            INSERT INTO purchase_request_items (
              purchase_request_id,
              product_id,
              quantity
            )
            VALUES (?, ?, ?)
          `,
          [id, item.product_id, item.quantity]
        );
      }
    }

    await connection.commit();

    return getPurchaseRequestById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updatePurchaseRequestStatus = async (
  id: number,
  status: PurchaseRequestStatus,
  approvedBy?: number
): Promise<PurchaseRequest | null> => {
  if (status === 'APPROVED' && approvedBy !== undefined) {
    await db.execute(
      `
        UPDATE purchase_requests
        SET
          status = ?,
          approved_by = ?
        WHERE id = ?
      `,
      [status, approvedBy, id]
    );
  } else {
    await db.execute(
      `
        UPDATE purchase_requests
        SET status = ?
        WHERE id = ?
      `,
      [status, id]
    );
  }

  return getPurchaseRequestById(id);
};