const mysql = require('mysql2');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '12621262',
    database: ''
  },
  );
  db.query('', function (err, results) {
  console.log(results);
});

const questions = [
  {
    type: 'list',
    message: 'Choose an action from the list:',
    name: 'start',
    choices: [
      'View all departments',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role'
    ]
  }
];

inquire()

function inquire() {
  inquirer
  .prompt(questions)
    .then((answers) => {
      switch (answers) {
        case 'View all departments':
          console.log('View all departments')
          break;
        case 'View all employees':
          console.log('View all employees')
          break;
        case 'Add a department':
          console.log('Add a department')
          break;
        case 'Add a role':
          console.log('Add a role')
          break;
        case 'Add an employee':
          console.log('Add an employee')
          break;
        case 'Update an employee role':
          console.log('Update an employee role')
          break;
      }
    })
}


