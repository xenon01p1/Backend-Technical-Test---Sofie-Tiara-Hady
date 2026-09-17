-- 1. Seed Warehouses (5 data)
INSERT INTO warehouses (code, name, location, is_active) VALUES
('WH-JKT-01', 'Gudang Utama Jakarta', 'Jl. Industri No. 12, Jakarta Utara', 1),
('WH-BDG-01', 'Gudang Cabang Bandung', 'Jl. Soekarno Hatta No. 45, Bandung', 1),
('WH-SUB-01', 'Gudang Cabang Surabaya', 'Jl. Rungkut Industri No. 88, Surabaya', 1),
('WH-SMG-01', 'Gudang Hub Semarang', 'Jl. Kaligawe Km. 5, Semarang', 1),
('WH-MED-01', 'Gudang Non-Aktif Medan', 'Jl. Medan Belawan No. 10, Medan', 0)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Seed Suppliers (10 data)
INSERT INTO suppliers (name, email, phone, is_active) VALUES
('PT Sumber Makmur Jaya', 'contact@sumbermakmur.com', '021-5550101', 1),
('CV Tech Utama', 'sales@techutama.co.id', '022-4440202', 1),
('PT Logistics Nusantara', 'info@logisticsnusantara.com', '031-3330303', 1),
('Bina Karya Distrindo', 'admin@binakarya.com', '024-2220404', 1),
('PT Global Agro Mandiri', 'support@globalagro.id', '061-1110505', 1),
('CV Elektrik Prima', 'orders@elektrikprima.com', '021-5550606', 1),
('PT Megah Abadi Sentosa', 'cs@megahabadi.com', '022-4440707', 1),
('PT Mitra Sejahtera', 'info@mitrasejahtera.com', '031-3330808', 1),
('UD Jaya Bersama', 'jayabersama@gmail.com', '024-2220909', 1),
('PT Nonaktif Supplier', 'contact@nonaktifsupplier.com', '021-5550000', 0);

-- 3. Seed Products (30 data)
INSERT INTO products (sku, name, stock, unit, is_active) VALUES
('PROD-001', 'Laptop Pro 14 Inch', 50, 'Unit', 1),
('PROD-002', 'Monitor LED 24 Inch', 120, 'Unit', 1),
('PROD-003', 'Mechanical Keyboard Wireless', 200, 'Pcs', 1),
('PROD-004', 'Mouse Ergonomic', 150, 'Pcs', 1),
('PROD-005', 'USB-C Docking Station', 85, 'Pcs', 1),
('PROD-006', 'Kabel HDMI 2.1 2 Meter', 500, 'Pcs', 1),
('PROD-007', 'External SSD 1TB', 60, 'Unit', 1),
('PROD-008', 'RAM DDR4 16GB 3200MHz', 140, 'Pcs', 1),
('PROD-009', 'Power Supply 650W Gold', 40, 'Unit', 1),
('PROD-010', 'Webcam Full HD 1080p', 90, 'Pcs', 1),
('PROD-011', 'Headset Wireless Gaming', 75, 'Unit', 1),
('PROD-012', 'Standing Desk Electric', 20, 'Unit', 1),
('PROD-013', 'Ergonomic Office Chair', 35, 'Unit', 1),
('PROD-014', 'Router Wi-Fi 6 Mesh', 80, 'Unit', 1),
('PROD-015', 'Kertas HVS A4 80gsm', 1000, 'Rim', 1),
('PROD-016', 'Tinta Printer Hitam', 300, 'Botol', 1),
('PROD-017', 'Tinta Printer Cyan', 150, 'Botol', 1),
('PROD-018', 'Tinta Printer Magenta', 150, 'Botol', 1),
('PROD-019', 'Tinta Printer Yellow', 150, 'Botol', 1),
('PROD-020', 'Stapler Heavy Duty', 90, 'Pcs', 1),
('PROD-021', 'Klip Kertas Standar', 2500, 'Box', 1),
('PROD-022', 'Stop Kontak 6 Lubang', 200, 'Pcs', 1),
('PROD-023', 'Kabel LAN Cat6 305M', 15, 'Roll', 1),
('PROD-024', 'Crimping Tool RJ45', 45, 'Pcs', 1),
('PROD-025', 'Tester Kabel LAN', 30, 'Pcs', 1),
('PROD-026', 'Smart TV 43 Inch', 25, 'Unit', 1),
('PROD-027', 'Proyektor Portable', 18, 'Unit', 1),
('PROD-028', 'UPS 1200VA', 40, 'Unit', 1),
('PROD-029', 'Produk Discontinued A', 0, 'Pcs', 0),
('PROD-030', 'Produk Non-Aktif B', 0, 'Pcs', 0)
ON DUPLICATE KEY UPDATE name=VALUES(name);