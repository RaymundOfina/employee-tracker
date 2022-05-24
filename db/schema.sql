DROP DATABASE IF EXISTS  employee_tracker_db;

CREATE DATABASE  employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE department(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  d_name VARCHAR(30)
);

CREATE TABLE roles(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30),
  salary INTEGER,
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee(
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INTEGER,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);