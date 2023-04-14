// const express = require("express");
// const mariadb = require("mariadb");
// const bcrypt = require("bcryptjs");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// const generateRandomString = (length) => {
//   return crypto.randomBytes(length).toString("hex");
// };
// const pool = mariadb.createPool({
//   host: process.env.DB_HOST,
//   port: 3307,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: process.env.DB_NAME,
//   connectionLimit: 5,
// });


// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// app.get("/", async (req, res) => {
//   try {
//     res.send("Hello api!")
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });
// app.get("/test", async (req, res) => {
//   try {
//     const connection = await pool.getConnection();
//     const result = await connection.query("SELECT * FROM users;");
//     connection.release();
//     res.status(201).send({ message: "User registered successfully." + result });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });
// app.post("/register", async (req, res) => {
//   try {
//     console.log(req.body);
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(req.body.password, salt);

//     const connection = await pool.getConnection();
//     const result = await connection.query(
//       "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
//       [req.body.nickname, req.body.email, hashedPassword]
//     );
//     connection.release();
//     res.status(201).send({ message: "User registered successfully." });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const connection = await pool.getConnection();
//     const rows = await connection.query("SELECT * FROM users WHERE email = ?", [
//       req.body.email,
//     ]);
//     connection.release();
//     if (rows.length === 0) {
//       return res.status(400).send({ error: "Email not found." });
//     }
//     const user = rows[0];
//     const isPasswordValid = await bcrypt.compare(
//       req.body.password,
//       user.password
//     );
//     if (!isPasswordValid) {
//       return res.status(400).send({ error: "Invalid password." });
//     }
//     const secretKey = generateRandomString(32);
//     // Generate JWT
//     const token = jwt.sign(
//       { id: user.id, username: user.username, email: user.email },
//       secretKey,
//       { expiresIn: "1h" }
//     );

//     res.status(200).send({
//       message: "Logged in successfully.",
//       token, // Send the token to the client
//       user: { id: user.id, username: user.username, email: user.email },
//     });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });
// app.get("/bbs", async (req, res) => {
//   try {
//     const connection = await pool.getConnection();
//     const result = await connection.query("SELECT bbs_uid, title, author, creation_date FROM E_BBS;");
//     connection.release();
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

// app.get("/bbs/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const connection = await pool.getConnection();
//     const result = await connection.query("SELECT bbs_uid, title, author, creation_date FROM E_BBS WHERE bbs_uid = ?", [id]);
//     connection.release();

//     if (result.length === 0) {
//       return res.status(404).send({ error: "Post not found." });
//     }

//     res.status(200).json(result[0]);
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });
