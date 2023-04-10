import { Request, Response } from "express";
import pool from "../database";
// Other code related to the BBS routes

export const getBbs = async (req: Request, res: Response) => {
  try {
    const connection = await pool.getConnection();
    const result = await connection.query(
      "SELECT bbs_uid, title, author, creation_date FROM E_BBS;"
    );
    connection.release();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send({ error: (error as Error).message });
  }
};
export const getBbsById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const connection = await pool.getConnection();
    const result = await connection.query(
      "SELECT bbs_uid, title, author, contents, creation_date FROM E_BBS WHERE bbs_uid = ?",
      [id]
    );
    console.log(result);
    connection.release();

    if (result.length === 0) {
      return res.status(404).send({ error: "Post not found." });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    res.status(500).send({ error: (error as Error).message });
  }
};

export const createBbsPost = async (req: Request, res: Response) => {
  try {
    const { title, author, contents } = req.body;
    const connection = await pool.getConnection();
    const result = await connection.query(
      "INSERT INTO E_BBS (title, author, contents, creation_date) VALUES (?, ?, ?, NOW())",
      [title, author, contents]
    );
    connection.release();
    res
      .status(201)
      .json({ message: "Post created successfully", id: result.insertId });
  } catch (error) {
    res.status(500).send({ error: (error as Error).message });
  }
};

export const deleteBbsPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const connection = await pool.getConnection();
    const result = await connection.query(
      "DELETE FROM E_BBS WHERE bbs_uid = ?",
      [id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: "Post not found." });
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: (error as Error).message });
  }
};
