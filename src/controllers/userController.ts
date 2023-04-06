import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../database";
// Other code related to the user routes

export const index = async (req: Request, res: Response) => {
  try {
    res.send("Hello API23!");
  } catch (error) {
    res.status(500).send({ error: (error as Error).message });
  }
};

export const test = async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query("SELECT * FROM users;");
    connection.release();
    res.status(200).send({ users: result });
  } catch (error) {
    res.status(500).send({ error: (error as Error).message });
  }
};
export const register = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const connection = await pool.getConnection();
    const result = await connection.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [req.body.nickname, req.body.email, hashedPassword]
    );
    connection.release();
    res.status(201).send({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).send({ error: (error as Error).message });
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const rows = await connection.query("SELECT * FROM users WHERE email = ?", [
      req.body.email,
    ]);
    connection.release();
    if (rows.length === 0) {
      return res.status(400).send({ error: "Email not found." });
    }
    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).send({ error: "Invalid password." });
    }
    const secretKey = crypto.randomBytes(32).toString("hex");
    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      secretKey,
      { expiresIn: "1h" }
    );

    res.status(200).send({
      message: "Logged in successfully.",
      token, // Send the token to the client
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).send({ error: (error as Error).message });
  }
};
