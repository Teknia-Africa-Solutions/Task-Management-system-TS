const mysql = require("mysql2/promise");

function createPool() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  if (!DB_USER || !DB_NAME) {
    return null;
  }

  return mysql.createPool({
    host: DB_HOST || "localhost",
    port: Number(DB_PORT) || 3306,
    user: DB_USER,
    password: DB_PASSWORD || "",
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

module.exports = { createPool };
