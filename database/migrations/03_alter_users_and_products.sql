-- Add ADMIN role to users
ALTER TABLE users
DROP CHECK users_chk_1;

ALTER TABLE users
ADD CONSTRAINT users_role_check
CHECK (role IN ('STAFF', 'APPROVER', 'ADMIN'));

-- Remove stock from products
ALTER TABLE products
DROP COLUMN stock;