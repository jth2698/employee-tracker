// Import our dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// Create/configure our MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "JtH@888237384",
  database: "employee_db"
});

// Connect to the MySQL server, and call `mainPrompt()` when connected
connection.connect(err => {
  if (err) {
    throw err;
  }
  mainPrompt();
});

let departments = [];
let roles = [];
let employees = [];

function populateDepartments() {
  const query = "SELECT * FROM departments";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    res.forEach(department => {
      departments.push({
        name: department.name,
        value: department.id,
      })
    })
    return departments;
  })
}

function populateRoles() {
  const query = "SELECT * FROM roles";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    res.forEach(role => {
      roles.push({
        name: role.title,
        value: role.id,
      })
    })
  })
  return roles;
}

function populateEmployees() {
  const query = "SELECT * FROM employees";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    res.forEach(employee => {
      employees.push({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      })
    })
  })
  return employees;
}

function mainPrompt() {
  inquirer.prompt({
    name: "choice",
    type: "rawlist",
    message: "What would you like to do?",
    choices: [
      "Add departments, roles, or employees",
      "View departments, roles, or employees",
      "Update employee roles",
      "Exit"
    ]
  }).then(onMainPromptAnswer);
}

function onMainPromptAnswer({ choice }) {
  switch (choice) {
    case "Add departments, roles, or employees":
      addData();
      break;

    case "View departments, roles, or employees":
      viewData();
      break;

    case "Update employee roles":
      updateData();
      break;

    case "Exit":
    default:
      exitTracker();
  }
}

function addData() {
  inquirer
    .prompt({
      name: "choice",
      type: "rawlist",
      message: "What data would you like to add?",
      choices: [
        "A new department",
        "A new role",
        "A new employee",
        "Exit"
      ]
    }).then(onAddDataAnswer);
}

function onAddDataAnswer({ choice }) {
  switch (choice) {
    case "A new department":
      addDepartment();
      break;

    case "A new role":
      populateDepartments();
      addRole();
      break;

    case "A new employee":
      populateRoles();
      populateEmployees();
      addEmployee();
      break;

    case "Exit":
    default:
      exitTracker();
  }
}

function addDepartment() {

  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "What is the name of the new department?"
    })
    .then(({ department }) => {
      const query = "INSERT INTO departments (name) VALUES (?)";
      connection.query(query, department, err => {
        if (err) {
          throw err;
        }
        console.log(`Added new department "${department}" to departments table!`);

        mainPrompt();
      })
    })
}

function addRole() {

  inquirer
    .prompt(
      [
        {
          name: "title",
          type: "input",
          message: "What is the title for the new role?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for the new role?"
        },
        {
          name: "departmentID",
          type: "rawlist",
          message: "What is the department for the new role?",
          choices: departments
        }
      ]
    ).then(({ title, salary, departmentID }) => {

      let query = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
      connection.query(query, [title, salary, departmentID], err => {
        if (err) {
          throw err;
        }
        console.log(`Added new title "${title}" to roles table at a salary of "${salary}" and with a department ID of "${departmentID}"!`);

        mainPrompt();
      })
    })
}

function addEmployee() {

  inquirer
    .prompt(
      [
        {
          name: "first",
          type: "input",
          message: "What is the first name of the new employee?"
        },
        {
          name: "last",
          type: "input",
          message: "What is the last name of the new employee?"
        },
        {
          name: "roleID",
          type: "rawlist",
          message: "What is the new employee's role?",
          choices: roles
        },
        {
          name: "managerID",
          type: "rawlist",
          message: "Who is the new employee's manager?",
          choices: employees
        }
      ]
    ).then(({ first, last, roleID, managerID }) => {
      const query = "INSERT INTO employees (first_name, last_name, role_ID, manager_ID) VALUES (?, ?, ?, ?)";
      connection.query(query, [first, last, roleID, managerID], err => {
        if (err) {
          throw err;
        }
        console.log(`Added new employee "${first} ${last}" to employees table with a roleID of "${roleID}" and a manager ID of "${managerID}"!`);

        mainPrompt();
      })
    })
}

function viewData() {

  populateEmployees();

  inquirer
    .prompt({
      name: "choice",
      type: "rawlist",
      message: "What data would you like to view?",
      choices: [
        "View department data",
        "View role data",
        "View employee data",
        "View employees by manager",
        "Exit"
      ]
    }).then(onViewDataAnswer);
}

function onViewDataAnswer({ choice }) {
  switch (choice) {
    case "View department data":
      viewDepartments();
      break;

    case "View role data":
      viewRoles();
      break;

    case "View employee data":
      viewEmployees();
      break;

    case "View employees by manager":
      populateEmployees();
      viewEmployeesByManager();
      break;

    case "Exit":
    default:
      exitTracker();
  }
}

function viewDepartments() {

  const query = "SELECT * FROM departments";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    const departmentData = cTable.getTable(res);
    console.log(departmentData);
    viewDifferentData();
  })
}

function viewRoles() {

  const query = "SELECT * FROM roles";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    const roleData = cTable.getTable(res);
    console.log(roleData);
    viewDifferentData();
  })
}

function viewEmployees() {

  const query = "SELECT * FROM employees";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    const employeeData = cTable.getTable(res);
    console.log(employeeData);
    viewDifferentData();
  })
}

function viewEmployeesByManager() {

  inquirer
    .prompt({
      name: "managerID",
      type: "rawlist",
      message: "Which employee's reports you like to view?",
      choices: employees,
    }).then(({ managerID }) => {

      const query = "SELECT * FROM employees WHERE manager_ID = ?";
      connection.query(query, [managerID], (err, res) => {
        if (err) {
          throw err;
        }
        const employeeByManagerData = cTable.getTable(res);
        console.log(employeeByManagerData);
        viewDifferentData();
      })
    })
}

function viewDifferentData() {
  inquirer
    .prompt({
      name: "view",
      type: "confirm",
      message: "View different data?",
    }).then(onViewDifferentDataAnswer);
}

function onViewDifferentDataAnswer(response) {
  if (response.view) {
    viewData();
  }
  else {
    exitTracker();
  }
}

function updateData() {
  populateEmployees();
  populateRoles();
  inquirer
    .prompt({
      name: "choice",
      type: "rawlist",
      message: "What employee data would you like to update?",
      choices: [
        "Employee role",
        "Employee manager",
        "Exit"
      ]
    }).then(onUpdateDataAnswer);
}

function onUpdateDataAnswer({ choice }) {
  switch (choice) {
    case "Employee role":
      chooseEmployeeForRole();
      break;

    case "Employee manager":
      chooseEmployeeForManager();
      break;

    case "Exit":
    default:
      exitTracker();
  }
}

function chooseEmployeeForRole() {


  inquirer
    .prompt({
      name: "employee",
      type: "rawlist",
      message: "Which employee would you like to update?",
      choices: employees
    }).then(employee => {
      employeeID = employee.employee;
      updateEmployeeRole(employeeID);
    })
}

function updateEmployeeRole(employeeID) {

  inquirer
    .prompt({
      name: "roleID",
      type: "rawlist",
      message: "What is this employee's new role?",
      choices: roles
    })
    .then(({ roleID }) => {
      const query = "UPDATE employees SET role_id = ? WHERE employees.id = ?";
      connection.query(query, [roleID, employeeID], err => {
        if (err) {
          throw err;
        }
        console.log(`Updated employee_id of "${employeeID}" to role_id "${roleID}"!`);

        mainPrompt();
      })
    })
}

function chooseEmployeeForManager() {

  inquirer
    .prompt({
      name: "employee",
      type: "rawlist",
      message: "Which employee would you like to update?",
      choices: employees,
    }).then(employee => {
      employeeID = employee.employee;
      updateEmployeeManager(employeeID);
    })
}

function updateEmployeeManager() {
  inquirer
    .prompt({
      name: "managerID",
      type: "rawlist",
      message: "Who is the employee's new manager?",
      choices: employees
    })
    .then(({ managerID }) => {
      const query = "UPDATE employees SET manager_id = ? WHERE employees.id = ?";
      connection.query(query, [managerID, employeeID], err => {
        if (err) {
          throw err;
        }
        console.log(`Updated employee_id "${employeeID}" to have a manager_id of "${managerID}"!`);

        mainPrompt();
      })
    })
}

function exitTracker() {
  console.log("exitTracker running");
  console.log("Goodbye!");
  connection.end();
}