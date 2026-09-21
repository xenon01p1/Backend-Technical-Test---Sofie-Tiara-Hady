-- 1. Seed Purchase Order (1 record)
INSERT INTO purchase_orders (po_number, purchase_request_id, supplier_id, warehouse_id, status, approved_by) VALUES
('PO-2026-000001', 1, 1, 1, 'approved', 3)
ON DUPLICATE KEY UPDATE status=VALUES(status);

INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity) VALUES
(1, 1, 10), -- Laptop Pro 14 Inch
(1, 2, 15), -- Monitor LED 24 Inch
(1, 5, 20)  -- USB-C Docking Station
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);