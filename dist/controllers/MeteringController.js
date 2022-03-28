"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Metering_1 = __importDefault(require("../models/Metering"));
const Device_1 = __importDefault(require("../models/Device"));
async function create(request, response) {
    try {
        const { data } = request.body;
        const metering = data[0];
        const meteringRepository = (0, typeorm_1.getRepository)(Metering_1.default);
        const meteringToSave = meteringRepository.create({
            flow_rate: metering.flow_rate.value,
            device_id: metering.id,
            timeInstant: metering.TimeInstant.value,
            humidity: metering.humidity.value,
            humiditySoil: metering.humiditySoil.value,
            commandInfo: metering.on_status.value ?? 'off',
            temperature: metering.temperature.value,
            totalFlow: metering.totalFlow.value
        });
        const deviceRepository = (0, typeorm_1.getRepository)(Device_1.default);
        const device = await deviceRepository.findOneOrFail({
            where: { device_id: metering.id }
        });
        deviceRepository.merge(device, { last_metering: metering.TimeInstant.value });
        await Promise.all([
            meteringRepository.save(meteringToSave),
            deviceRepository.save(device)
        ]);
        return response.sendStatus(201);
    }
    catch (error) {
        return response.status(400).json({ message: Object(error).message });
    }
}
exports.default = {
    create
};
