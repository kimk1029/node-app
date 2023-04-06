"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// database.ts
const mariadb_1 = __importDefault(require("mariadb"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = mariadb_1.default.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5,
});
exports.default = pool;
