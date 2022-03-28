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
const Yup = __importStar(require("yup"));
const Device_1 = __importDefault(require("../models/Device"));
async function create(request, response) {
    try {
        const { userId } = request.headers;
        const { name, device_id, description } = request.body;
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            device_id: Yup.string().required(),
            description: Yup.string().required()
        });
        await schema.validate({ name, device_id, description }, { abortEarly: false });
        const deviceRepository = (0, typeorm_1.getRepository)(Device_1.default);
        const checkIfDeviceAlreadyExists = await deviceRepository.findOne({
            where: { device_id }
        });
        if (checkIfDeviceAlreadyExists) {
            throw new Error('Endereço de email já está sendo utilizado');
        }
        const device = deviceRepository.create({
            name,
            device_id,
            description,
            active: false,
            user_id: userId?.toString()
        });
        await deviceRepository.save(device);
        return response.sendStatus(201);
    }
    catch (error) {
        return response.status(400).json({ message: Object(error).message });
    }
}
async function index(request, response) {
    try {
        const { userId } = request.headers;
        const deviceRepository = (0, typeorm_1.getRepository)(Device_1.default);
        const devices = await deviceRepository.find({
            where: { user_id: userId }
        });
        return response.status(200).json({
            devices: devices,
            amount: devices.length
        });
    }
    catch (error) {
        return response.status(404).json({ message: Object(error).message });
    }
}
exports.default = {
    create,
    index
};
