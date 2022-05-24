const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require("console.table");


// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    port:3001,
    user: "root",
    password: []
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

let finished = false;

const main = async () => {
    // Main loop until user selects 'Exit Application'
    while(!finished){
        console.clear();
                
        const {choice} = await promptMain();

        if(choice === 'Exit Application'){
            finished = true;
        }else if(choice === 'View all Departments'){
            viewDepartments();
        }else if(choice === 'View all Roles'){
            viewRoles();
        }else if(choice === 'View all Employees'){
            viewEmployees();
        }else if(choice === 'Add a Department'){
            await addDept();
            console.log('\nDepartment Added!')
            pause(1500);
        }
        else if(choice === 'Add a Role'){
            await addRole();
            console.log('\Role Added!')
            pause(1500);
        }
        else if(choice === 'Add an Employee'){
            await addEmployee();
            console.log('\nEmployee Added!')
            pause(1500);
        }
        else if(choice === 'Update Employee Role'){
            await roleUpdate();
            console.log('\nEmployee Role Updated!')
            pause(1500);
        }
    }
}

// Main questions for loop
async function promptMain(){
    return inquirer.prompt([
     {
         type: 'list',
         name: 'choice',
         message: '\nWhat would you like to do?\n',
         choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role', 'Exit Application'],
     }
     ])
}

// View all departments
async function viewDepartments (){
    let sql = `SELECT department.id AS 'ID', department.d_name AS 'Dept. Name' FROM department`;
    
    const result = await db.promise().query(sql);

    console.clear();

    console.log('\n[Departments]\n');
    console.table(result[0]);
    console.log('(Press up or down to show the main menu)');
}

// Shows Roles
async function viewRoles(){
    let sql = `SELECT roles.id AS 'ID', 
    roles.title AS 'Title', 
    department.d_name AS 'Dept. Name', 
    CONCAT('$', FORMAT(roles.salary, 0)) AS 'Salary' 
    FROM roles 
    JOIN department ON roles.department_id = department.id
    ORDER BY roles.title`;

    const result = await db.promise().query(sql);

    console.clear();

    console.log('\n[Roles]\n');
    console.table(result[0]);
    console.log('(Press up or down to show the main menu)');
}

// shows all employees
async function viewEmployees(){
    let sql = `select e.id ID, 
    CONCAT(e.first_name, ' ', e.last_name) Name, 
    roles.title Role, 
    department.d_name AS 'Dept.',  
    CONCAT('$', FORMAT(roles.salary, 0)) Salary, 
    CONCAT(m.first_name, ' ', m.last_name) Manager 
    FROM employee e 
    LEFT JOIN roles ON e.role_id = roles.id 
    LEFT JOIN department ON department.id = roles.department_id 
    LEFT JOIN employee m ON m.id = e.manager_id`;

    const result = await db.promise().query(sql);

    console.clear();

    console.log('\n[Employees]\n');
    console.table(result[0]);
    console.log('(Press up or down to show the main menu)');
}

// Add a department
async function addDept(){
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter the department name!');
                    return false;
                }
            }
        }
    ]).then(data => {
        // Insert response from inquirer into database
        db.query(`INSERT INTO department (d_name) VALUES ('${data.name}')`, (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

// Add a role
async function addRole(){
    let ids = []
    let names = []
   
    let sql = `SELECT * FROM department`;
    let result = await db.promise().query(sql);

    // First array position is the array of objects
    result[0].forEach(obj => {
        ids.push(obj.id);
        names.push(obj.d_name);
    })
    
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is the name of the role?',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter the role name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role?',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log('Please enter the salary of the role!');
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'choice',
            message: 'Which department does the role belong to?\n',
            choices: names
        }
    ]).then(data => {
        let dep_id;
        for(let a=0;a<names.length;a++){
            if(names[a] === data.choice){
                dep_id = ids[a];
                break;
            }
        }
        // response from inquirer
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${data.name}', ${parseInt(data.salary)}, ${parseInt(dep_id)})`, (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

// Add employee
async function addEmployee(){
    let role_ids = [];
    let roles = [];
    let manager_ids = [];
    let managers = [];
   
    let sql = `SELECT * FROM roles`;
    let result = await db.promise().query(sql);


    result[0].forEach(obj => {
        role_ids.push(obj.id);
        roles.push(obj.title);
    })

    sql = `SELECT * FROM employee`;
    result = await db.promise().query(sql);

   
    result[0].forEach(obj => {
        if(obj.manager_id === null){
            manager_ids.push(obj.id);
            managers.push(obj.first_name + ' ' + obj.last_name);
        }
    })

    return inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: `What is the employee's first name?`,
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log(`Please enter the employee's first  name!`);
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'last',
            message: `What is the employee's last name?`,
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log(`Please enter the employee's last name!`);
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'role',
            message: `What is the employee's role?\n`,
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: `Who is the employee's manager?\n`,
            choices: managers
        }
    ]).then(data => {
        let role_id;
        for(let a=0;a<roles.length;a++){
            if(roles[a] === data.role){
                role_id = role_ids[a];
                break;
            }
        }

        let manager_id;
        for(let a=0;a<managers.length;a++){
            if(managers[a] === data.manager){
                manager_id = manager_ids[a];
                break;
            }
        }

        // Insert response from inquirer into database
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.first}', '${data.last}', ${parseInt(role_id)}, ${parseInt(manager_id)})`, (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

// Update employee role
async function roleUpdate(){
    let role_ids = [];
    let roles = [];
    let employee_ids = [];
    let employees = [];
   
    let sql = `SELECT * FROM roles ORDER BY title`;
    let result = await db.promise().query(sql);
    
    // First array position is the array of objects
    result[0].forEach(obj => {
        role_ids.push(obj.id);
        roles.push(obj.title);
    })

    sql = `SELECT * FROM employee`;
    result = await db.promise().query(sql);

    // First array position is the array of objects
    result[0].forEach(obj => {
        employee_ids.push(obj.id);
        employees.push(obj.first_name + ' ' + obj.last_name);
    })
    
    return inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: `Which employee's role would you like to update?\n`,
            choices: employees
        },
        {
            type: 'list',
            name: 'role',
            message: `What role should this employee belong to?\n`,
            choices: roles
        }
    ]).then(data => {
        let employee_id;
        for(let a=0;a<employees.length;a++){
            if(employees[a] === data.employee){
                employee_id = employee_ids[a];
                break;
            }
        }
        
        let role_id;
        for(let a=0;a<roles.length;a++){
            if(roles[a] === data.role){
                role_id = role_ids[a];
                break;
            }
        }

        let sql = `UPDATE employee 
        SET role_id = ${parseInt(role_id)} 
        WHERE id = ${parseInt(employee_id)}`;

        // Insert response from inquirer into database
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

// Helper Function
// Used to display a message until returning to the main menu
function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}

// Exit the application
function quit() {
    console.log("Goodbye!");
    process.exit();
  }
  

main();
