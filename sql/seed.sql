
INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 80000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("CFO", 200000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Engineer", 130000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("UI/UX", 150000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Team Lead", 90000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sally", "yu", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Pain", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Madison", "lee", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "cooper", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("timmy", "smith", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Amanda", "Lu", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("bill", "Thomas", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Max", "Cruz", 1, 2);
