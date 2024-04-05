const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "userRegistrationData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Database connected");

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
let dbs = new sqlite3.Database('userRegistrationData.db');

// Create userRegisteration table
dbs.serialize(() => {
  dbs.run("CREATE TABLE IF NOT EXISTS userRegisteration (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT)");
});

// Close the database connection
dbs.close();


app.post("/register/", async (request, response) => {
    const { username, password, email } = request.body;
    const selectQuery = `SELECT * FROM userRegisteration WHERE Username='${username}'`;
    const dbUser = await db.get(selectQuery);

    if (!dbUser) {
        const insertQuery = `INSERT INTO userRegisteration
            (Username, Password, Email)
            VALUES
            ('${username}', '${password}', '${email}')`;
        await db.run(insertQuery);
        response.status(200).send("User created successfully");
    } else {
        response.status(400).send("Username already exists");
    }
});
