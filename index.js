// imports mysql2 and inquirer
const mysql = require('mysql2');
const inquirer = require('inquirer');

// create a connect with mysql2 to the database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '12621262',
    database: 'employee_db'
  },
);
// starting questions for inquirer
const questions = [
  {
    type: 'list',
    message: 'Choose an action from the list:',
    name: 'start',
    choices: [
      'View all departments',
      'View all employees',
      'View all roles',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'View budget by department',
      'Remove a department',
      'Remove a role',
      'Remove an employee'
    ]
  }
];
// questions for adding an employee
const questionsTwo = [
  {
    type: 'input',
    message: 'Input first name:',
    name: 'first'
  },
  {
    type: 'input',
    message: 'Input last name:',
    name: 'last'
  }
];
// questions for adding a new department
const questionsThree = [
  {
    type: 'input',
    message: 'Input new department name:',
    name: 'department'
  }
];
// invoking inquirer function on application start
inquire()
// function to prompt the starting actions with switch cases to each function that runs
function inquire() {
  inquirer
    .prompt(questions)
    .then((answers) => {
      switch (answers.start) {
        case 'View all departments':
          viewDepartments()
          break;
        case 'View all employees':
          viewEmployees()
          break;
        case 'View all roles':
          viewRoles()
          break;
        case 'Add a department':
          addDepartment()
          break;
        case 'Add a role':
          addRoles()
          break;
        case 'Add an employee':
          addEmployee()
          break;
        case 'Update an employee role':
          updateEmployeeRole()
          break;
        case 'View employees by manager':
          employeeManager()
          break;
        case 'View budget by department':
          viewBudgetsByDepartment()
          break;
        case 'Remove a department':
          deleteDepartment()
          break;
        case 'Remove a role':
          deleteRoles()
          break;
        case 'Remove an employee':
          deleteEmployee()
          break;
      }
    })
}
// function to view all departments as a console table
function viewDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results)
  })
}
// function to view all employees as a console table
function viewEmployees() {
  db.query('Select * FROM employee', function (err, results) {
    console.table(results)
  })
}
// function to view all roles as a console table
function viewRoles() {
  db.query('Select * FROM roles', function (err, results) {
    console.table(results)
  })
}

// promise query to select all from the employee table
function employeeChoices() {
  return db.promise().query('SELECT * FROM employee')
}
// promise query to select all from the roles table
function roleChoices() {
  return db.promise().query('SELECT * FROM roles')
}
// function to update employee role
function updateEmployeeRole() {
  // this will map the response at index 0 to create the choices for employee
  employeeChoices().then(response => {
    const eChoices = response[0].map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }))
    // this inquirer prompt will use the choices we mapped above as the employee select
    inquirer
      .prompt([
        {
          type: 'list',
          message: 'Select an employee to update their role',
          name: 'employees',
          choices: eChoices
        }
      ])
      // mapping the roles choices and creating a variable for employee id
      .then(response => {
        let employeeId = response.employees
        roleChoices().then(response => {
          const rChoices = response[0].map(({ id, title }) => ({
            name: title,
            value: id
          }))
          inquirer
            .prompt([
              {
                type: 'list',
                message: 'Choose an updated role for this employee',
                name: 'roles',
                choices: rChoices
              }
            ])
            // db query that updates the role_id of the employee at the id we defined above
            .then(response => {
              db.query('UPDATE employee SET role_id=? WHERE id=?', [response.roles, employeeId])
            })
            .then(() => {
              console.log('Successfully updated employee role')
              inquire()
            })
        })
      })
  })
}
// promise query to select all from the department table
function departmentChoices() {
  return db.promise().query('SELECT * FROM department')

}
// function to add roles
function addRoles() {
  departmentChoices().then(response => {
    // mapping the response at index 0 to create the department choices
    const dChoices = response[0].map(({ id, department_name }) => ({
      name: department_name,
      value: id
    }))
    // inquirer prompt that uses dChoices const created above
    inquirer
      .prompt([
        {
          type: 'input',
          message: 'Input new role name:',
          name: 'role'
        },
        {
          type: 'input',
          message: 'Input a salary:',
          name: 'salary'
        },
        {
          type: 'list',
          message: 'Choose a department:',
          name: 'departmentChoice',
          choices: dChoices
        }
      ])
      // creating the new role with the answers above.
      .then(answer => {
        let roleName = {
          title: answer.role,
          salary: answer.salary,
          department_id: answer.departmentChoice,
        }
        // inserting the new role creating into the roles table
        db.promise().query('INSERT INTO roles SET ?', roleName)
          .then(() => {
            console.log('successfully added role')
            inquire()
          })
      })
  }
  )
}
// function to add an employee
function addEmployee() {
  inquirer
    .prompt(questionsTwo)
    // used the answers object from the prompt to create variables for name
    .then(answers => {
      let firstName = answers.first;
      let lastName = answers.last;
      // db promise query that is mapped to create a title with an id for role choices
      db.promise().query('SELECT * FROM roles').then(response => {
        let roleChoices = response[0].map(({ id, title }) => ({
          name: title,
          value: id
        }))
        // inquirer prompt using the roleChoices variable
        inquirer
          .prompt({
            type: 'list',
            message: 'What is employees role?',
            name: 'roleid',
            choices: roleChoices
          })
          // promise query selects the employee table content and is mapped for the first and last name with id included
          .then(response => {
            let roleid = response.roleid
            db.promise().query('SELECT * FROM employee').then(response => {
              let managerChoices = response[0].map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
              }))
              // added no manager with value null to the top of choices for manager
              managerChoices.unshift({ name: 'none', value: null })
              inquirer
                .prompt({
                  type: 'list',
                  message: 'What is employees manager?',
                  name: 'managerid',
                  choices: managerChoices
                })
                // created the employee object with all the variables above so we can insert the object into the table
                .then(response => {
                  let employee = {
                    first_name: firstName,
                    last_name: lastName,
                    role_id: roleid,
                    manager_id: response.managerid
                  }
                  // inserts employee object into table
                  db.promise().query('INSERT INTO employee SET ?', employee)
                    .then(() => {
                      console.log('successfully added employee')
                    })
                  .then(() => {
                    inquire()
                  })
                })
            })
          })
      })
    })
}
// promise query that uses left join to create a table with grouping of department and budget of said department
function viewBudget() {
  return db.promise().query('SELECT department.id, department.department_name, SUM(roles.salary) AS utilized_budget FROM employee LEFT JOIN roles ON employee.role_id=roles.id LEFT JOIN department ON roles.department_id=department.id GROUP BY department.id, department.department_name')
}
// function that allows us to display the table created in viewBudget
function viewBudgetsByDepartment() {
  viewBudget().then(response => {
    console.table(response[0])
  })
}
// function to add department using the questions from the top
function addDepartment() {
  inquirer
    .prompt(questionsThree)
    .then(answer => {
      let departmentName = {
        department_name: answer.department
      }
      db.promise().query('INSERT INTO department SET ?', departmentName)
        .then(() => {
          console.log('successfully added department')
          inquire()
        })
    })
}
// remove department promise query that is called at the end of the following deleteDepartment function
function removeDepartment(departmentId) {
  return db.promise().query('DELETE FROM department WHERE id=?', departmentId)
}

function deleteDepartment() {
  // mapped the response into dChoices with department_name and id to be displayed in the following inquirer prompt
  departmentChoices().then(response => {
    console.log(response[0])
    const dChoices = response[0].map(({ id, department_name }) => ({
      name: department_name,
      value: id
    }))
    inquirer
      .prompt([
        {
          type: 'list',
          message: 'Choose a department to delete',
          name: 'departmentDelete',
          choices: dChoices
        }
      ])
      // .then that calls the removeDepartment function to remove the choice the user picks
      .then(response => {
        removeDepartment(response.departmentDelete)
        console.log('Successfully deleted department')
      })
      .then(() => {
        inquire()
      })
  })
}
// removeRoles function works the same as removeDepartment, promise query that is called at the end of the deleteRoles function
function removeRoles(rolesId) {
  return db.promise().query('DELETE FROM roles WHERE id=?', rolesId)
}

function deleteRoles() {
  roleChoices().then(response => {
    // mapped the response into rChoices with title and id to be displayed in the following inquirer prompt
    console.log(response[0])
    const rChoices = response[0].map(({ id, title }) => ({
      name: title,
      value: id
    }))
    inquirer
      .prompt([
        {
          type: 'list',
          message: 'Choose a role to delete',
          name: 'roleDelete',
          choices: rChoices
        }
      ])
      // .then that calls the removeRoles function to remove the choice the user picks
      .then(response => {
        removeRoles(response.roleDelete)
        console.log('Successfully deleted role')
      })
      .then(() => {
        inquire()
      })
  })
}
// remove employee promise query that is called at the end of the following deleteEmployee function
function removeEmployee(employeeId) {
  return db.promise().query('DELETE FROM employee WHERE id=?', employeeId)
}

function deleteEmployee() {
  // mapped the response into eChoices with first_name, last_name, and id to be displayed in the following inquirer prompt
  employeeChoices().then(response => {
    console.log(response[0])
    const eChoices = response[0].map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id
    }))
    inquirer
      .prompt([
        {
          type: 'list',
          message: 'Choose an employee to delete',
          name: 'employeeDelete',
          choices: eChoices
        }
      ])
      // .then that calls the removeEmployee function to remove the choice the user picks
      .then(response => {
        removeEmployee(response.employeeDelete)
        console.log('Successfully deleted employee')
      })
      .then(() => {
        inquire()
      })
  })
}