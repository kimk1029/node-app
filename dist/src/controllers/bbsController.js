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
exports.getBbsById = exports.getBbs = void 0;
const database_1 = __importDefault(require("../database"));
// Other code related to the BBS routes
const getBbs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield database_1.default.getConnection();
        const result = yield connection.query("SELECT bbs_uid, title, author, creation_date FROM E_BBS;");
        connection.release();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.getBbs = getBbs;
const getBbsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const connection = yield database_1.default.getConnection();
        const result = yield connection.query("SELECT bbs_uid, title, author, contents, creation_date FROM E_BBS WHERE bbs_uid = ?", [id]);
        console.log(result);
        connection.release();
        if (result.length === 0) {
            return res.status(404).send({ error: "Post not found." });
        }
        res.status(200).json(result[0]);
    }
    catch (error) {
        res.status(500).send({ error: error.message });
    }
});
exports.getBbsById = getBbsById;
