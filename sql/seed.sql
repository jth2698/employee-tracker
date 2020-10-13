USE employee_db;

INSERT INTO departments (name)
VALUES ("executive"),
("sales"),
("accounting");

INSERT INTO roles (title, salary, department_id)
VALUES ("CEO", 100000.00, 1),
("Sales Representative", 25000.00, 2),
("Accountant", 50000.00, 3);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ("Charlie", "Ceo", 1),
("Sarah", "Salesrep", 2),
("Andy", "Accountant", 3)
