// database.ts
import mariadb, { Pool } from "mariadb";
import dotenv from "dotenv";

dotenv.config();

const pool: Pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

export default pool;
