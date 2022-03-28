"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevices1648174777128 = void 0;
const typeorm_1 = require("typeorm");
class createDevices1648174777128 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'devices',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v1()'
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'device_id',
                    type: 'varchar'
                },
                {
                    name: 'description',
                    type: 'varchar'
                },
                {
                    name: 'active',
                    type: 'boolean'
                },
                {
                    name: 'user_id',
                    type: 'varchar'
                },
                {
                    name: 'last_metering',
                    type: 'varchar',
                    isNullable: true
                }
            ],
            foreignKeys: [
                {
                    name: 'DeviceUser',
                    columnNames: ['user_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                }
            ]
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('devices');
    }
}
exports.createDevices1648174777128 = createDevices1648174777128;
