-- Roles
-- ID sẽ tự động tăng từ 1
INSERT INTO roles (name) VALUES ('ROLE_EMPLOYEE'); -- ID 1
INSERT INTO roles (name) VALUES ('ROLE_MANAGER');  -- ID 2
INSERT INTO roles (name) VALUES ('ROLE_FINANCE');  -- ID 3
INSERT INTO roles (name) VALUES ('ROLE_ADMIN');    -- ID 4

-- User admin
-- Chúng ta gán thẳng role_id = 4 (ID của ROLE_ADMIN)
-- để tránh lỗi timing của subquery
INSERT INTO users (full_name, email, password, role_id)
VALUES (
  'Admin User',
  'admin@example.com',
  '$2a$12$RBqttzESi6H72IAVKwloF.XYwuWOoueTQPvtsYVmnExTxCJm8BfFe',
  4
);