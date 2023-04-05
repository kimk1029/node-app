const express = require('express');
const mariadb = require('mariadb');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    port: 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
});

console.log(mariadb)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get("/test", async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const result = await connection.query('SELECT * FROM users;');
        connection.release();
        res.status(201).send({ message: 'User registered successfully.' + result });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
})
app.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const connection = await pool.getConnection();
        const result = await connection.query('INSERT INTO members (username, email, password) VALUES (?, ?, ?)', [req.body.nickname, req.body.email, hashedPassword]);
        connection.release();
        res.status(201).send({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const rows = await connection.query('SELECT * FROM members WHERE email = ?', [req.body.email]);
        connection.release();

        if (rows.length === 0) {
            return res.status(400).send({ error: 'Email not found.' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({ error: 'Invalid password.' });
        }

        res.status(200).send({ message: 'Logged in successfully.', user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {

    }
});