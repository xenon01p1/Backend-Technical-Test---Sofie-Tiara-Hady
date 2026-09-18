INSERT INTO users (username, pass, email, phone, role, is_active)
VALUES 
  (
    'john_staff',
    '$2a$12$e8N3/G11Q3J.3cO9A21C0e/oO3d.N3X6zU5oJ6Qe0fM3C2B1A0x9.', -- 'password123'
    'john.staff@company.com',
    '+6281234567890',
    'STAFF',
    true
  ),
  (
    'jane_staff',
    '$2a$12$e8N3/G11Q3J.3cO9A21C0e/oO3d.N3X6zU5oJ6Qe0fM3C2B1A0x9.', -- 'password123'
    'jane.staff@company.com',
    '+6281234567891',
    'STAFF',
    true
  ),
  (
    'alex_approver',
    '$2a$12$e8N3/G11Q3J.3cO9A21C0e/oO3d.N3X6zU5oJ6Qe0fM3C2B1A0x9.', -- 'password123'
    'alex.approver@company.com',
    '+6281234567892',
    'APPROVER',
    true
  ),
  (
    'sarah_approver',
    '$2a$12$e8N3/G11Q3J.3cO9A21C0e/oO3d.N3X6zU5oJ6Qe0fM3C2B1A0x9.', -- 'password123'
    'sarah.approver@company.com',
    '+6281234567893',
    'APPROVER',
    true
  ),
  (
    'inactive_staff',
    '$2a$12$e8N3/G11Q3J.3cO9A21C0e/oO3d.N3X6zU5oJ6Qe0fM3C2B1A0x9.', -- 'password123'
    'inactive.staff@company.com',
    '+6281234567894',
    'STAFF',
    false
  );