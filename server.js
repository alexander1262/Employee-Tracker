const mysql = require('mysql2');
const inquirer = require('inquirer');
const PORT = process.env.PORT || 3001;
const app = express();

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
