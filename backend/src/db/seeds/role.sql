INSERT INTO role (name, description, is_active) VALUES
('admin', 'Administrator with full access', TRUE),
('owner', 'Owner with special permissions', TRUE),
('manager', 'Manager with supervisory access', TRUE),
('sales', 'Sales personnel with customer access', TRUE);

INSERT INTO users (
    first_name,
    last_name,
    email,
    phone,
    address,
    isBlocked,
    salt,
    password,
    username,
    image,
    page_name,
    business_address,
    createdat,
    updatedat,
    roleId
) VALUES (
    'Md Ragib',
    'Shahriar',
    'diner.ragib@gmail.com', -- Set a valid email
    '01714906170', -- Set a valid phone number
    'Gangni, Meherpur', -- Set a valid address
    false, -- isBlocked
    '$2b$10$PtD9Qkv/opUjcsuVug.ld.', -- Replace with the generated salt
    '$2b$10$PtD9Qkv/opUjcsuVug.ld.TZWp4jxkGOMhyxkWCb2dAkHSw5FBwEy', -- Replace with the hashed password
    'ragib',
    NULL, -- image (nullable)
    NULL, -- page_name (nullable)
    NULL, -- business_address (nullable)
    NOW(), -- createdat
    NOW(), -- updatedat
    (SELECT id FROM role WHERE name = 'admin') -- Assuming roles table has a unique 'admin' role
);