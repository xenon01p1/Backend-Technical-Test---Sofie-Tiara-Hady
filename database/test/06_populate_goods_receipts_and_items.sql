-- 1. Seed Goods Receipts (2 records: 1st partial, 2nd final delivery)
INSERT INTO goods_receipts (goods_receipt_number, purchase_order_id) VALUES
('GR-2026-000001', 1), -- Delivery 1 (Partial)
('GR-2026-000002', 1)  -- Delivery 2 (Fulfills remaining quantity)
ON DUPLICATE KEY UPDATE goods_receipt_number = VALUES(goods_receipt_number);

-- 2. Seed Goods Receipt Items
INSERT INTO goods_receipt_items (goods_receipt_id, product_id, quantity) VALUES
-- GR 1 (GR-2026-000001) - Partial Receipt
(1, 1, 6),  -- Laptop Pro 14 Inch (6 out of 10 received)
(1, 2, 10), -- Monitor LED 24 Inch (10 out of 15 received)
(1, 5, 20), -- USB-C Docking Station (20 out of 20 received -> Fully received)

-- GR 2 (GR-2026-000002) - Final Receipt
(2, 1, 4),  -- Laptop Pro 14 Inch (Remaining 4 received -> 10/10 total)
(2, 2, 5)   -- Monitor LED 24 Inch (Remaining 5 received -> 15/15 total)
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);