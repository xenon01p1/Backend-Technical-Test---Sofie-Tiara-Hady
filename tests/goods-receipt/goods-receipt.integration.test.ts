import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { db } from '../../src/config/database.js';
import * as goodsReceiptService from '../../src/services/goods-receipt.service.js';

let userId: number;
let productId: number;
let warehouseId: number;
let supplierId: number;
let purchaseRequestId: number;
let purchaseOrderId: number;

const testPrefix = `TEST-${Date.now()}`;

describe('Goods Receipt Integration', () => {
  beforeAll(async () => {
    /*
     * Create test user.
     * We use an existing user instead of creating one because
     * authentication is not part of these integration tests.
     */
    const [users] = await db.query<any[]>(
      'SELECT id FROM users LIMIT 1'
    );

    if (users.length === 0) {
      throw new Error(
        'No user exists in the database. Run the database seed first.'
      );
    }

    userId = users[0].id;

    // Create test warehouse
    const [warehouseResult] = await db.execute<any>(
      `
      INSERT INTO warehouses
        (code, name, location, is_active)
      VALUES
        (?, ?, ?, 1)
      `,
      [
        `${testPrefix}-WH`,
        `${testPrefix} Warehouse`,
        'Test Location',
      ]
    );

    warehouseId = warehouseResult.insertId;

    // Create test product
    const [productResult] = await db.execute<any>(
      `
      INSERT INTO products
        (sku, name, unit, is_active)
      VALUES
        (?, ?, ?, 1)
      `,
      [
        `${testPrefix}-SKU`,
        `${testPrefix} Product`,
        'pcs',
      ]
    );

    productId = productResult.insertId;

    // Create test supplier
    const [supplierResult] = await db.execute<any>(
        `
        INSERT INTO suppliers
            (name, email, phone, is_active)
        VALUES
            (?, ?, ?, 1)
        `,
        [
            `${testPrefix} Supplier`,
            `${testPrefix.toLowerCase()}@example.com`,
            '080000000000',
        ]
    );

    supplierId = supplierResult.insertId;

    // Create approved Purchase Request
    const [prResult] = await db.execute<any>(
      `
      INSERT INTO purchase_requests
        (
          request_number,
          warehouse_id,
          requested_by,
          status,
          approved_by
        )
      VALUES
        (?, ?, ?, 'APPROVED', ?)
      `,
      [
        `${testPrefix}-PR`,
        warehouseId,
        userId,
        userId,
      ]
    );

    purchaseRequestId = prResult.insertId;

    // Add 100 units to the Purchase Request
    await db.execute(
      `
      INSERT INTO purchase_request_items
        (
          purchase_request_id,
          product_id,
          quantity
        )
      VALUES
        (?, ?, 100)
      `,
      [
        purchaseRequestId,
        productId,
      ]
    );

    // Create ORDERED Purchase Order directly.
    // This lets the tests focus specifically on Goods Receipt.
    const [poResult] = await db.execute<any>(
      `
      INSERT INTO purchase_orders
        (
          po_number,
          purchase_request_id,
          supplier_id,
          warehouse_id,
          status
        )
      VALUES
        (?, ?, ?, ?, 'ORDERED')
      `,
      [
        `${testPrefix}-PO`,
        purchaseRequestId,
        supplierId,
        warehouseId,
      ]
    );

    purchaseOrderId = poResult.insertId;

    await db.execute(
      `
      INSERT INTO purchase_order_items
        (
          purchase_order_id,
          product_id,
          ordered_quantity,
          received_quantity
        )
      VALUES
        (?, ?, 100, 0)
      `,
      [
        purchaseOrderId,
        productId,
      ]
    );
  });

  afterAll(async () => {
    if (purchaseOrderId) {
        await db.execute(
        `
        DELETE FROM goods_receipt_items
        WHERE goods_receipt_id IN (
            SELECT id
            FROM goods_receipts
            WHERE purchase_order_id = ?
        )
        `,
        [purchaseOrderId]
        );

        await db.execute(
        `
        DELETE FROM goods_receipts
        WHERE purchase_order_id = ?
        `,
        [purchaseOrderId]
        );

        await db.execute(
        `
        DELETE FROM purchase_order_items
        WHERE purchase_order_id = ?
        `,
        [purchaseOrderId]
        );

        await db.execute(
        `
        DELETE FROM purchase_orders
        WHERE id = ?
        `,
        [purchaseOrderId]
        );
    }

    if (purchaseRequestId) {
        await db.execute(
        `
        DELETE FROM purchase_request_items
        WHERE purchase_request_id = ?
        `,
        [purchaseRequestId]
        );

        await db.execute(
        `
        DELETE FROM purchase_requests
        WHERE id = ?
        `,
        [purchaseRequestId]
        );
    }

    if (warehouseId && productId) {
        await db.execute(
        `
        DELETE FROM inventory_movements
        WHERE warehouse_id = ?
            AND product_id = ?
        `,
        [warehouseId, productId]
        );

        await db.execute(
        `
        DELETE FROM inventories
        WHERE warehouse_id = ?
            AND product_id = ?
        `,
        [warehouseId, productId]
        );
    }

    if (supplierId) {
        await db.execute(
        `
        DELETE FROM suppliers
        WHERE id = ?
        `,
        [supplierId]
        );
    }

    if (productId) {
        await db.execute(
        `
        DELETE FROM products
        WHERE id = ?
        `,
        [productId]
        );
    }

    if (warehouseId) {
        await db.execute(
        `
        DELETE FROM warehouses
        WHERE id = ?
        `,
        [warehouseId]
        );
    }

    await db.end();
    });

  it('cannot receive quantity greater than ordered quantity', async () => {
    await expect(
        goodsReceiptService.createGoodsReceipt(userId, {
        purchase_order_id: purchaseOrderId,
        items: [
            {
            product_id: productId,
            quantity: 101,
            },
        ],
        })
    ).rejects.toThrow(
        `Received quantity for product ${productId} exceeds ordered quantity.`
    );

    const [rows] = await db.query<any[]>(
        `
        SELECT received_quantity
        FROM purchase_order_items
        WHERE purchase_order_id = ?
        AND product_id = ?
        `,
        [purchaseOrderId, productId]
    );

    expect(rows[0].received_quantity).toBe(0);
  });

  it('Goods Receipt increases warehouse stock', async () => {
    const goodsReceipt =
      await goodsReceiptService.createGoodsReceipt(userId, {
        purchase_order_id: purchaseOrderId,
        items: [
          {
            product_id: productId,
            quantity: 40,
          },
        ],
      });

    expect(goodsReceipt).toBeDefined();

    const [rows] = await db.query<any[]>(
      `
      SELECT quantity
      FROM inventories
      WHERE warehouse_id = ?
        AND product_id = ?
      `,
      [warehouseId, productId]
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].quantity).toBe(40);
  });

  it('Fully received Purchase Order becomes RECEIVED', async () => {
    // 40 units were received by the previous test.
    // Receive the remaining 60 units.
    await goodsReceiptService.createGoodsReceipt(userId, {
      purchase_order_id: purchaseOrderId,
      items: [
        {
          product_id: productId,
          quantity: 60,
        },
      ],
    });

    const [rows] = await db.query<any[]>(
      `
      SELECT
        po.status,
        poi.ordered_quantity,
        poi.received_quantity
      FROM purchase_orders po
      INNER JOIN purchase_order_items poi
        ON poi.purchase_order_id = po.id
      WHERE po.id = ?
        AND poi.product_id = ?
      `,
      [purchaseOrderId, productId]
    );

    expect(rows).toHaveLength(1);
    expect(rows[0].ordered_quantity).toBe(100);
    expect(rows[0].received_quantity).toBe(100);
    expect(rows[0].status).toBe('RECEIVED');
  });
});