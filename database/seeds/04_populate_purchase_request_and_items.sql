-- 1. Seed Purchase Requests (3 records)
INSERT INTO purchase_requests (request_number, warehouse_id, requested_by, status, approved_by) VALUES
('PR-2026-000001', 1, 1, 'approved', 3), -- Requested by john_staff (1) for Gudang Utama Jakarta (1), approved by alex_approver (3)
('PR-2026-000002', 2, 2, 'pending', NULL),  -- Requested by jane_staff (2) for Gudang Cabang Bandung (2), pending
('PR-2026-000003', 3, 1, 'rejected', 4)   -- Requested by john_staff (1) for Gudang Cabang Surabaya (3), rejected by sarah_approver (4)
ON DUPLICATE KEY UPDATE status=VALUES(status), approved_by=VALUES(approved_by);

-- 2. Seed Purchase Request Items (8 records)
INSERT INTO purchase_request_items (purchase_request_id, product_id, quantity) VALUES
-- Items for PR-2026-000001 (PR ID: 1) - Gudang Utama Jakarta
(1, 1, 10), -- Laptop Pro 14 Inch
(1, 2, 15), -- Monitor LED 24 Inch
(1, 5, 20), -- USB-C Docking Station

-- Items for PR-2026-000002 (PR ID: 2) - Gudang Cabang Bandung
(2, 3, 50), -- Mechanical Keyboard Wireless
(2, 4, 50), -- Mouse Ergonomic
(2, 6, 30), -- Kabel HDMI 2.1 2 Meter

-- Items for PR-2026-000003 (PR ID: 3) - Gudang Cabang Surabaya
(3, 7, 5),  -- External SSD 1TB
(3, 8, 10)  -- RAM DDR4 16GB 3200MHz
ON DUPLICATE KEY UPDATE quantity=VALUES(quantity);