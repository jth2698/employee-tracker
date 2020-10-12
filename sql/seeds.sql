USE employee_db;

INSERT INTO department (name)
VALUES ("executive");
VALUES ("sales");
VALUES ("accounting");

INSERT INTO role (title, salary)
VALUES ("CEO", 100000.00);
VALUES ("Sales Representative", 25000.00);
VALUES ("Accountant", 50000.00);

INSERT INTO employee (first_name, last_name)
VALUES ("Charlie", "Ceo");
VALUES ("Sarah", "Salesrep");
VALUES ("Andy", "Accountant");
