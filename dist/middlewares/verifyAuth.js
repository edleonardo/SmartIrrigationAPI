"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("../config/auth"));
function verifyAuth(req, res, next) {
    // Validacao do token
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new Error('Está faltando o token JWT');
    }
    // Bearer Token
    const [, token] = authHeader.split(' ');
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, auth_1.default.jwt.secret);
        const { sub } = decoded;
        req.headers.userId = sub;
        return next();
    }
    catch {
        throw new Error('Token JWT inválido');
    }
}
exports.default = verifyAuth;
