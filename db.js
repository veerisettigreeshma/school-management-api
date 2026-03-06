const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "nodeuser",
  password: "node123",
  database: "schooldb"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

module.exports = db;