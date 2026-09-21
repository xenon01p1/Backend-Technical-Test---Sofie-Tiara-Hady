import { db } from '../config/database.js';
export const createGoodsReceipt = async (goodsReceiptNumber, data) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        /*
         * Lock the Purchase Order first.
         * This serializes concurrent Goods Receipts for the same PO.
         */
        const [poRows] = await connection.execute(`
        SELECT
          id,
          warehouse_id,
          status
        FROM purchase_orders
        WHERE id = ?
        FOR UPDATE
      `, [data.purchase_order_id]);
        if (poRows.length === 0) {
            throw new Error('Purchase Order not found.');
        }
        const purchaseOrder = poRows[0];
        if (purchaseOrder.status !== 'ORDERED' &&
            purchaseOrder.status !== 'PARTIALLY_RECEIVED') {
            throw new Error('Goods Receipt can only be created for an ORDERED or PARTIALLY_RECEIVED Purchase Order.');
        }
        /*
         * Lock all PO items before checking received quantities.
         */
        const [poItemRows] = await connection.execute(`
        SELECT
          id,
          purchase_order_id,
          product_id,
          ordered_quantity,
          received_quantity
        FROM purchase_order_items
        WHERE purchase_order_id = ?
        ORDER BY id ASC
        FOR UPDATE
      `, [data.purchase_order_id]);
        const poItemsByProduct = new Map(poItemRows.map(item => [item.product_id, item]));
        /*
         * Validate every Goods Receipt item against
         * the locked Purchase Order items.
         */
        for (const item of data.items) {
            const poItem = poItemsByProduct.get(item.product_id);
            if (!poItem) {
                throw new Error(`Product ${item.product_id} is not included in the Purchase Order.`);
            }
            const newReceivedQuantity = poItem.received_quantity + item.quantity;
            if (newReceivedQuantity > poItem.ordered_quantity) {
                throw new Error(`Received quantity for product ${item.product_id} exceeds ordered quantity.`);
            }
        }
        /*
         * Create Goods Receipt header.
         */
        const [grResult] = await connection.execute(`
        INSERT INTO goods_receipts (
          goods_receipt_number,
          purchase_order_id
        )
        VALUES (?, ?)
      `, [
            goodsReceiptNumber,
            data.purchase_order_id,
        ]);
        const goodsReceiptId = grResult.insertId;
        /*
         * Create Goods Receipt items.
         */
        for (const item of data.items) {
            await connection.execute(`
          INSERT INTO goods_receipt_items (
            goods_receipt_id,
            product_id,
            quantity
          )
          VALUES (?, ?, ?)
        `, [
                goodsReceiptId,
                item.product_id,
                item.quantity,
            ]);
        }
        /*
         * Update received quantities on PO items.
         */
        for (const item of data.items) {
            await connection.execute(`
          UPDATE purchase_order_items
          SET received_quantity = received_quantity + ?
          WHERE id = ?
        `, [
                item.quantity,
                poItemsByProduct.get(item.product_id).id,
            ]);
        }
        /*
         * Calculate the new PO status from all PO items.
         */
        const allReceived = poItemRows.every(item => {
            const receivedInThisRequest = data.items.find(grItem => grItem.product_id === item.product_id)?.quantity ?? 0;
            return (item.received_quantity + receivedInThisRequest >=
                item.ordered_quantity);
        });
        const anyReceived = poItemRows.some(item => {
            const receivedInThisRequest = data.items.find(grItem => grItem.product_id === item.product_id)?.quantity ?? 0;
            return item.received_quantity + receivedInThisRequest > 0;
        });
        let newStatus;
        if (allReceived) {
            newStatus = 'RECEIVED';
        }
        else if (anyReceived) {
            newStatus = 'PARTIALLY_RECEIVED';
        }
        else {
            newStatus = 'ORDERED';
        }
        await connection.execute(`
        UPDATE purchase_orders
        SET status = ?
        WHERE id = ?
      `, [newStatus, data.purchase_order_id]);
        /*
         * Update inventory and create inventory movements.
         */
        for (const item of data.items) {
            await connection.execute(`
          INSERT INTO inventories (
            product_id,
            warehouse_id,
            quantity
          )
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE
            quantity = quantity + VALUES(quantity)
        `, [
                item.product_id,
                purchaseOrder.warehouse_id,
                item.quantity,
            ]);
            await connection.execute(`
          INSERT INTO inventory_movements (
            warehouse_id,
            product_id,
            movement_type,
            quantity,
            reference
          )
          VALUES (?, ?, 'PURCHASE_RECEIPT', ?, ?)
        `, [
                purchaseOrder.warehouse_id,
                item.product_id,
                item.quantity,
                goodsReceiptNumber,
            ]);
        }
        await connection.commit();
        const goodsReceipt = await getGoodsReceiptById(goodsReceiptId);
        if (!goodsReceipt) {
            throw new Error('Failed to retrieve created Goods Receipt.');
        }
        return goodsReceipt;
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
};
export const getGoodsReceiptById = async (id) => {
    const [grRows] = await db.execute(`
      SELECT
        id,
        goods_receipt_number,
        purchase_order_id,
        created_at,
        updated_at
      FROM goods_receipts
      WHERE id = ?
      LIMIT 1
    `, [id]);
    if (grRows.length === 0) {
        return null;
    }
    const gr = grRows[0];
    const [itemRows] = await db.execute(`
        SELECT
          id,
          goods_receipt_id,
          product_id,
          quantity,
          created_at,
          updated_at
        FROM goods_receipt_items
        WHERE goods_receipt_id = ?
        ORDER BY id ASC
      `, [id]);
    return {
        ...gr,
        items: itemRows,
    };
};
