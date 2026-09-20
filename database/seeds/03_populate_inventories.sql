-- Seed Inventories (10 data)
INSERT INTO inventories (product_id, warehouse_id, quantity) VALUES
(1, 1, 30),  -- Laptop Pro 14 Inch in Gudang Utama Jakarta
(1, 2, 20),  -- Laptop Pro 14 Inch in Gudang Cabang Bandung
(2, 1, 70),  -- Monitor LED 24 Inch in Gudang Utama Jakarta
(2, 3, 50),  -- Monitor LED 24 Inch in Gudang Cabang Surabaya
(3, 1, 100), -- Mechanical Keyboard Wireless in Gudang Utama Jakarta
(3, 2, 60),  -- Mechanical Keyboard Wireless in Gudang Cabang Bandung
(3, 4, 40),  -- Mechanical Keyboard Wireless in Gudang Hub Semarang
(4, 1, 90),  -- Mouse Ergonomic in Gudang Utama Jakarta
(4, 3, 60),  -- Mouse Ergonomic in Gudang Cabang Surabaya
(5, 1, 85)   -- USB-C Docking Station in Gudang Utama Jakarta
ON DUPLICATE KEY UPDATE quantity = VALUES(quantity);