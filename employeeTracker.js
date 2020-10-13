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

function mainPrompt() {
  inquirer.prompt({
    name: "action",
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

function onMainPromptAnswer({ action }) {
  switch (action) {
    case "Add departments, roles, or employees":
      addData();
      break;

    case "View departments, roles, or employees":
      viewData();
      break;

    case "Update employee roles":
      chooseEmployee();
      break;

    case "Exit":
    default:
      exitTracker();
  }
}

function addData() {
  inquirer
    .prompt({
      name: "data",
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

function onAddDataAnswer({ action }) {
  switch (action) {
    case "A new department":
      addDepartment();
      break;

    case "A new role":
      addRole();
      break;

    case "A new employee":
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
    .then(({ answer }) => {
      const newDepartment = {
        department: answer.department
      }
      const query = "INSERT INTO departments SET ?";
      connection.query(query, newDepartment, err => {
        if (err) {
          throw err;
        }
        console.log(`Added new department: ${newDepartment.department} to DEPARTMENTS TABLE!`);

        mainPrompt();
      })
    })
}

function addRole() {
  inquirer
    .prompt(
      [
        {
          name: "role",
          type: "input",
          message: "What is the name of the new role?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for the new role?"
        }
      ]
    )
    .then(({ answers }) => {
      const newRole = {
        role: answers.role,
        salary: answers.salary
      }
      const query = "INSERT INTO roles SET ?";
      connection.query(query, newRole, err => {
        if (err) {
          throw err;
        }
        console.log(`Added new role: ${newRole.role} to ROLES TABLE at a salary of ${newRole.salary}!`);

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
        }
      ]
    )
    .then(({ answers }) => {
      const newEmployee = {
        firstName: answers.first,
        lastName: answers.last
      }
      const query = "INSERT INTO employees SET ?";
      connection.query(query, newEmployee, err => {
        if (err) {
          throw err;
        }
        console.log(`Added new employee: ${newEmployee.firstName} ${newEmployee.lastName} to EMPLOYEES TABLE!`);

        mainPrompt();
      })
    })
}

function viewData() {
  inquirer
    .prompt({
      name: "data",
      type: "rawlist",
      message: "What data would you like to view?",
      choices: [
        "View department data",
        "View role data",
        "View employee data",
        "Exit"
      ]
    }).then(onViewDataAnswer);
}

function onViewDataAnswer({ action }) {
  switch (action) {
    case "View department data":
      viewDepartments();
      break;

    case "View role data":
      viewRoles();
      break;

    case "View employee data":
      viewEmployees();
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
  })
}

function chooseEmployee() {

  const employees = [];

  const query = "SELECT * FROM employees ?";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    res.forEach(employee);
    employees.push(`${employee.last_name}`);

    inquirer
      .prompt({
        name: "data",
        type: "rawlist",
        message: "Which employee would you like to update?",
        choices: employees,
      }).then(updateEmployeeRole(answer));
  })
}

function updateEmployeeRole(answer) {
  const employee = answer;
  inquirer
    .prompt({
      name: "role",
      type: "rawlist",
      message: "What is this employee's new role?",
      choices: [
        "CEO",
        "Sales Representative",
        "Accountant"
      ]
    })
    .then(({ newRole }) => {
      if (newRole == "CEO") {
        let roleID = 1;
      }
      if (newRole == "Sales Representative") {
        let roleID = 2;
      }
      if (newRole == "Accountant") {
        let roleID = 3;
      }
      const query = "UPDATE employees.role_id SET role_id = ? WHERE employee.last_name = ?";
      connection.query(query, { roleID }, { employee }, err => {
        if (err) {
          throw err;
        }
        console.log(`Updated employee ${employee} to ROLE_ID: ${roleID}!`);

        mainPrompt();
      });
    });
}

function exitTracker() {
  console.log("Goodbye!");
  connection.end();
}