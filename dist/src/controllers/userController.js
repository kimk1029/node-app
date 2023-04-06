"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = exports.test = exports.index = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const database_1 = __importDefault(require("../database"));
// Other code related to the user routes
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send("Hello API!");
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.index = index;
const test = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield database_1.default.getConnection();
        const result = yield connection.query("SELECT * FROM users;");
        connection.release();
        res.status(200).send({ users: result });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.test = test;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(req.body.password, salt);
        const connection = yield database_1.default.getConnection();
        const result = yield connection.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [req.body.nickname, req.body.email, hashedPassword]);
        connection.release();
        res.status(201).send({ message: "User registered successfully." });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield database_1.default.getConnection();
        const rows = yield connection.query("SELECT * FROM users WHERE email = ?", [
            req.body.email,
        ]);
        connection.release();
        if (rows.length === 0) {
            return res.status(400).send({ error: "Email not found." });
        }
        const user = rows[0];
        const isPasswordValid = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(400).send({ error: "Invalid password." });
        }
        const secretKey = crypto_1.default.randomBytes(32).toString("hex");
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, email: user.email }, secretKey, { expiresIn: "1h" });
        res.status(200).send({
            message: "Logged in successfully.",
            token,
            user: { id: user.id, username: user.username, email: user.email },
        });
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.login = login;
