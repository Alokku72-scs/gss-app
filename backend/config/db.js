// require('dotenv').config();
// const mysql = require('mysql2');

// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// });

// db.connect(err => {
//     if (err) {
//         console.error('Database connection failed:', err);
//     } else {
//         console.log('Connected to MySQL');
//     }
// });

// module.exports = db;

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '20.197.53.204',
  port: 3306,
  user: 'isaksham_2023',   // Replace with actual MySQL username
  password: 'Isaksham2023!', // Replace with actual MySQL password
  database: 'nonprod_12052023'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected successfully!');
  }
});

function pingdb() {
  connection.query(`SELECT 1 + 1 AS solution`, function (err, _result) {
    if (err) throw err;
    console.log("Ping DB");
  });
}

setInterval(pingdb, 40000);

module.exports = connection;
