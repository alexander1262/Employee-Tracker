const mysql = require('mysql2');
const inquirer = require('inquirer');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '12621262',
    database: 'employee_db'
  },
);

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
      'Update an employee role'
    ]
  }
];

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

const questionsThree = [
  {
    type: 'input',
    message: 'Input new department name:',
    name: 'department'
  }
];

inquire()

function inquire() {
  inquirer
    .prompt(questions)
    .then((answers) => {
      console.log(answers)
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
          console.log('Update an employee role')
          break;
      }
    })
}

function viewDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    console.table(results)
  })
}

function viewEmployees() {
  db.query('Select * FROM employee', function (err, results) {
    console.table(results)
  })
}

function viewRoles() {
  db.query('Select * FROM roles', function (err, results) {
    console.table(results)
  })
}

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
        })
    })
}

function departmentChoices() {
  let newDepartmentChoices = [];
  db.query('SELECT department_name FROM department', function (err, results) {
    let newDepartmentChoices = results;
    return newDepartmentChoices;
  });
  return newDepartmentChoices;
}

const questionsFour = [
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
    choices: departmentChoices()
  }
];

function addRoles() {
  inquirer
    .prompt(questionsFour)
    .then(answer => {
      let roleName = {
        title: answer.role,
        salary: answer.salary,
        department_id: answer.departmentChoice,
      }
      db.promise().query('INSERT INTO roles SET ?', roleName)
        .then(() => {
          console.log('successfully added role')
        })
    })
}

function addEmployee() {
  inquirer
    .prompt(questionsTwo)
    .then(answers => {
      let firstName = answers.first;
      let lastName = answers.last;
      db.promise().query('SELECT * FROM roles').then(response => {
        let roleChoices = response[0].map(({ id, title }) => ({
          name: title,
          value: id
        }))
        console.log(roleChoices)
        inquirer
          .prompt({
            type: 'list',
            message: 'What is employees role?',
            name: 'roleid',
            choices: roleChoices
          })
          .then(response => {
            let roleid = response.roleid
            db.promise().query('SELECT * FROM employee').then(response => {
              let managerChoices = response[0].map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
              }))
              managerChoices.unshift({name: 'none', value: null})
              console.log(managerChoices)
              inquirer
              .prompt({
                type: 'list',
                message: 'What is employees manager?',
                name: 'managerid',
                choices: managerChoices
              })
              .then(response => {
                let employee = {
                  first_name: firstName,
                  last_name: lastName,
                  role_id: roleid,
                  manager_id: response.managerid
                }
                console.log(employee)
                db.promise().query('INSERT INTO employee SET ?', employee)
                .then(() => {
                  console.log('successfully added employee')
                })
              })
            })
          })
      })
    })
}