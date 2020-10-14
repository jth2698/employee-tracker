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
      name: "action",
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
  console.log("addDepartment running");
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
  console.log("addRole running");

  departments = [];
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
      )
      .then(({ title, salary, departmentID }) => {
        const newRole = {
          title: title,
          salary: salary,
          departmentID: departmentID
        }
        const query = "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)";
        connection.query(query, [newRole.title, newRole.salary, newRole.departmentID], err => {
          if (err) {
            throw err;
          }
          console.log(`Added new title "${newRole.title}" to roles table at a salary of "${newRole.salary}" and with a department ID of "${newRole.departmentID}"!`);

          mainPrompt();
        })
      })
  })
}

function addEmployee() {
  console.log("addEmployee running");

  roles = [];
  let query = "SELECT * FROM roles";
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

  employees = [];
  query = "SELECT * FROM employees";
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
    )
    .then(({ first, last, roleID, managerID }) => {
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
  console.log("viewData running");
  inquirer
    .prompt({
      name: "action",
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

    case "View employees by manager":
      viewEmployeesByManager();
      break;

    case "Exit":
    default:
      exitTracker();
  }
}

function viewDepartments() {
  console.log("viewDepartments running");
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
  console.log("addRoles running");
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
  console.log("viewEmployees running");
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

  console.log("chooseEmployeeForView running");

  const employees = [];
  const query = "SELECT * FROM employees";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }

    res.forEach((employee) => {
      employees.push({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      })
    });

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
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What employee data would you like to update?",
      choices: [
        "Employee role",
        "Employee manager",
        "Exit"
      ]
    }).then(onUpdateDataAnswer);
}

function onUpdateDataAnswer({ action }) {
  switch (action) {
    case "Employee role":
      chooseEmployeeForRoleUpdate();
      break;

    case "Employee manager":
      chooseEmployeeForManagerUpdate();
      break;

    case "Exit":
    default:
      exitTracker();
  }
}

function chooseEmployeeForRoleUpdate() {

  console.log("chooseEmployees running");

  const employees = [];

  const query = "SELECT * FROM employees";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    res.forEach(employee => {
      employees.push(`${employee.first_name} ${employee.last_name}`);
    });

    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "Which employee would you like to update?",
        choices: employees,
      }).then(updateEmployeeRole);
  })
}

function updateEmployeeRole({ action }) {
  console.log("updateEmployeeRole running");

  const employeeLast = action.split(' ')[1];

  let roles = [];
  let query = "SELECT * FROM roles";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    res.forEach(role => {
      roles.push({
        name: role.title,
        value: role.id
      })
    })
  })

  console.log(roles);

  inquirer
    .prompt({
      name: "roleID",
      type: "rawlist",
      message: "What is this employee's new role?",
      choices: roles
    })
    .then(({ roleID }) => {
      const query = "UPDATE employees SET role_id = ? WHERE employees.last_name = ?";
      connection.query(query, [roleID, employeeLast], err => {
        if (err) {
          throw err;
        }
        console.log(`Updated employee "${employeeLast}" to role_id "${roleID}"!`);

        mainPrompt();
      });
    });
}

function chooseEmployeeForManagerUpdate() {

  console.log("chooseEmployees running");

  const employees = [];

  const query = "SELECT * FROM employees";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    res.forEach(employee => {
      employees.push(`${employee.first_name} ${employee.last_name}`);
    });

    console.log(employees);

    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "Which employee would you like to update?",
        choices: employees,
      }).then(updateManager);
  })
}

function updateManager({ action }) {
  console.log("updateManager running");

  const employeeLast = action.split(' ')[1];

  let employees = [];
  let query = "SELECT * FROM employees";
  connection.query(query, (err, res) => {
    if (err) {
      throw err;
    }
    res.forEach(employees => {
      employees.push({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      })
    })
  })

  inquirer
    .prompt({
      name: "managerID",
      type: "rawlist",
      message: "Who is the employee's new manager?",
      choices: employees
    })
    .then(({ managerID }) => {
      const query = "UPDATE employees SET manager_id = ? WHERE employees.last_name = ?";
      connection.query(query, [managerID, employeeLast], err => {
        if (err) {
          throw err;
        }
        console.log(`Updated employee "${employeeLast}" to manager_id "${managerID}"!`);

        mainPrompt();
      });
    });
}

function exitTracker() {
  console.log("exitTracker running");
  console.log("Goodbye!");
  connection.end();
}