-- Drops the employee_db if it already exists --
DROP DATABASE IF EXISTS employee_db;

-- Created the DB "employee_db" (only works on local connections)
CREATE DATABASE employee_db;

-- Use the DB employee_db for all the rest of the script
USE employee_db;

-- Create the table "department"
CREATE TABLE departments (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY(id)
);

-- Create the table "role"
CREATE TABLE roles (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT REFERENCES departments(id),
  PRIMARY KEY(id)
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT REFERENCES roles(id),
  manager_id INT REFERENCES employees(id),
  PRIMARY KEY(id)
);