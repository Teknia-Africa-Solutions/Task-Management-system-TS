const path = require("path");
const backendModules = path.join(__dirname, "../../backend/node_modules");

require(path.join(backendModules, "dotenv")).config({
  path: path.join(__dirname, "../../.env"),
});

const bcrypt = require(path.join(backendModules, "bcryptjs"));
const { createPool } = require("../../backend/src/config/db");

const pool = createPool();

const users = [
  {
    name: "Super Administrator",
    email: "superadmin@example.com",
    password: "password123",
    role: "SuperAdmin",
  },
  {
    name: "Administrator",
    email: "admin@example.com",
    password: "password123",
    role: "Admin",
  },
  {
    name: "Team Member",
    email: "member@example.com",
    password: "password123",
    role: "Member",
  },
];

async function seedUsers() {
  if (!pool) {
    console.error("Database is not configured. Set DB_USER and DB_NAME in .env.");
    process.exit(1);
  }

  try {
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);

      await pool.query(
        `INSERT INTO users (name, email, password, role)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           password = VALUES(password),
           role = VALUES(role)`,
        [user.name, user.email, hashedPassword, user.role]
      );
    }

    console.log("Users created successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error creating users:", error);
    process.exit(1);
  }
}

seedUsers();
