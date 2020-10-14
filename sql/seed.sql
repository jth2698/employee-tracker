USE employee_db;

INSERT INTO departments (name)
VALUES 
("Executive"),
("Sales"),
("Accounting");

INSERT INTO roles (title, salary, department_id)
VALUES 
("CEO", 100000.00, 1),
("CSO", 75000.00, 2),
("CFO", 75000.00, 3);

INSERT INTO employees (first_name, last_name, role_id)
VALUES 
("Paul", "President", 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Sarah", "Sales", 2, 1),
("Tina", "Treasurer", 3, 1)