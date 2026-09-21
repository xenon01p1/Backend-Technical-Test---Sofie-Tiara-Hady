import { db } from '../config/database.js';
export const createPurchaseOrder = async (poNumber, data, warehouseId, items) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [poResult] = await connection.execute(`
        INSERT INTO purchase_orders (
          po_number,
          purchase_request_id,
          supplier_id,
          warehouse_id,
          status
        )
        VALUES (?, ?, ?, ?, 'DRAFT')
      `, [
            poNumber,
            data.purchase_request_id,
            data.supplier_id,
            warehouseId,
        ]);
        const purchaseOrderId = poResult.insertId;
        for (const item of items) {
            await connection.execute(`
          INSERT INTO purchase_order_items (
            purchase_order_id,
            product_id,
            ordered_quantity,
            received_quantity
          )
          VALUES (?, ?, ?, 0)
        `, [
                purchaseOrderId,
                item.product_id,
                item.ordered_quantity,
            ]);
        }
        await connection.commit();
        const purchaseOrder = await getPurchaseOrderById(purchaseOrderId);
        if (!purchaseOrder) {
            throw new Error('Failed to retrieve created Purchase Order.');
        }
        return purchaseOrder;
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
};
export const getPurchaseOrderById = async (id) => {
    const [poRows] = await db.execute(`
      SELECT
        id,
        po_number,
        purchase_request_id,
        supplier_id,
        warehouse_id,
        status,
        created_at,
        updated_at
      FROM purchase_orders
      WHERE id = ?
      LIMIT 1
    `, [id]);
    if (poRows.length === 0) {
        return null;
    }
    const po = poRows[0];
    const [itemRows] = await db.execute(`
      SELECT
        id,
        purchase_order_id,
        product_id,
        ordered_quantity,
        received_quantity,
        created_at,
        updated_at
      FROM purchase_order_items
      WHERE purchase_order_id = ?
      ORDER BY id ASC
    `, [id]);
    return {
        ...po,
        items: itemRows,
    };
};
export const getPurchaseOrdersByCursor = async (filter) => {
    const conditions = [];
    const params = [];
    if (filter.status) {
        conditions.push('po.status = ?');
        params.push(filter.status);
    }
    if (filter.supplier_id) {
        conditions.push('po.supplier_id = ?');
        params.push(filter.supplier_id);
    }
    if (filter.purchase_request_id) {
        conditions.push('po.purchase_request_id = ?');
        params.push(filter.purchase_request_id);
    }
    if (filter.requested_by) {
        conditions.push('pr.requested_by = ?');
        params.push(filter.requested_by);
    }
    if (filter.cursor) {
        conditions.push('po.id < ?');
        params.push(filter.cursor);
    }
    const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';
    const limit = filter.limit ?? 10;
    const [rows] = await db.execute(`
      SELECT
        po.id,
        po.po_number,
        po.purchase_request_id,
        po.supplier_id,
        po.warehouse_id,
        po.status,
        po.created_at,
        po.updated_at
      FROM purchase_orders po
      INNER JOIN purchase_requests pr
        ON pr.id = po.purchase_request_id
      ${whereClause}
      ORDER BY po.id DESC
      LIMIT ?
    `, [...params, limit]);
    const data = [];
    for (const row of rows) {
        const [itemRows] = await db.execute(`
        SELECT
          id,
          purchase_order_id,
          product_id,
          ordered_quantity,
          received_quantity,
          created_at,
          updated_at
        FROM purchase_order_items
        WHERE purchase_order_id = ?
        ORDER BY id ASC
      `, [row.id]);
        data.push({
            ...row,
            items: itemRows,
        });
    }
    return {
        data,
        pagination: {
            limit,
            next_cursor: data.length === limit
                ? data[data.length - 1].id
                : null,
        },
    };
};
export const updatePurchaseOrderStatus = async (id, status) => {
    await db.execute(`
      UPDATE purchase_orders
      SET status = ?
      WHERE id = ?
    `, [status, id]);
    return getPurchaseOrderById(id);
};
