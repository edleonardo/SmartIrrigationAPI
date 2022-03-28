"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const User_1 = __importDefault(require("./User"));
let Device = class Device {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid')
], Device.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' })
], Device.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean' })
], Device.prototype, "active", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' })
], Device.prototype, "device_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' })
], Device.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' })
], Device.prototype, "last_metering", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.default, user => user.name),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' })
], Device.prototype, "user_id", void 0);
Device = __decorate([
    (0, typeorm_1.Entity)('devices')
], Device);
exports.default = Device;
