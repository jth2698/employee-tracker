# Employee Tracker Application [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Deployed Application

CLI only. Please see screencastify recording for demo.

## Screenshot

CLI only. See above.

## Description

A simple employee tracker application that allows users to add departments, roles, and employees to three seperate tables stored in an employee_db database in MySQL. The application is structured as follows - 

* The `sql` directory includes a `schema.sql` file with the database structure.
* The `sql` directory also includes includes a `seed.sql` that can be used to populate the `employee_db` database with seed data.
* The `employeeTracker.js` file in the main directory includes the JavaScript needed to run the CLI.
* `employeeTracker.js` relies on three dependencies: `mysql`, `inquirer`, and `console.table `.
* `employeeTracker.js` initiates user prompts allowing the user to add, view, and update data in three tables within `employee_db`
* As the user inputs information, `employeeTracker.js` automatically updates each new employee "role" with a unique "role_ID" and each new employee with a unique "employee_ID" and a "manager_ID" that is the same as the manager employee's employee_ID
* This allows the user to view employees by manager. When the user selects a manager, the employees reporting to that manager are automatically displayed.

## Table of Contents
* [Installation](#installation)
* [Usage](#usage)
* [Contribution Guidelines](#contribution)
* [Testing](#testing) 
* [License](#license)
* [Questions](#questions)
  
## Installation

* Users should git clone the repository. 
* Users should then run `schema.sql` through MySQL to create the needed `employees_db` database. 
* If the user wants to seed `employees_db` with data, `seed.sql` should also be run through MySQL.

## Usage

* The CLI relies on `node.js` to run. 
* Users should run `npm install` from the local directory to install the dependencies.
* The CLI rilies on `node.js` to run.
* To initialize the CLI, users should run `node employeeTracker.js` from the local directory.

## Contribution Guidelines

All contributions welcome.

## Testing

No testing included.

## License

MIT

## Questions

* <https://github.com/jth2698>
* <jth2698@gmail.com>