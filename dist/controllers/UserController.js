"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("../config/auth"));
const Yup = __importStar(require("yup"));
const User_1 = __importDefault(require("../models/User"));
async function authenticate(request, response) {
    try {
        const { email, password } = request.body;
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required()
        });
        await schema.validate({ email, password }, { abortEarly: false });
        const usersRepository = (0, typeorm_1.getRepository)(User_1.default);
        const user = await usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error('Combinação de email/senha incorreta');
        }
        const passwordMatch = await (0, bcryptjs_1.compare)(password, user.password);
        if (!passwordMatch) {
            throw new Error('Combinação de email/senha incorreta');
        }
        const token = (0, jsonwebtoken_1.sign)({}, auth_1.default.jwt.secret, {
            subject: user.id,
            expiresIn: auth_1.default.jwt.expiresIn,
        });
        return response.status(200).json({
            user,
            token
        });
    }
    catch (error) {
        return response.status(400).json({ message: Object(error).message });
    }
}
async function create(request, response) {
    try {
        const { email, password, name } = request.body;
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });
        await schema.validate({ email, password, name }, { abortEarly: false });
        const userRepository = (0, typeorm_1.getRepository)(User_1.default);
        const checkIfUserAlreadyExists = await userRepository.findOne({
            where: { email },
        });
        if (checkIfUserAlreadyExists) {
            throw new Error('Endereço de email já está sendo utilizado');
        }
        const hashSenha = await (0, bcryptjs_1.hash)(password, 8);
        const user = userRepository.create({
            name,
            email,
            password: hashSenha,
        });
        await userRepository.save(user);
        return response.sendStatus(201);
    }
    catch (error) {
        return response.status(400).json({ message: Object(error).message });
    }
}
async function update(request, response) {
    try {
        const { id } = request.params;
        const { email, password, name } = request.body;
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        });
        await schema.validate({ email, password, name }, { abortEarly: false });
        const userRepository = (0, typeorm_1.getRepository)(User_1.default);
        const user = await userRepository.findOneOrFail(id);
        userRepository.merge(user, { email, password, name });
        await userRepository.save(user);
        response.sendStatus(204);
    }
    catch (error) {
        return response.status(404).json({ message: Object(error).message });
    }
}
exports.default = {
    authenticate,
    create,
    update
};
