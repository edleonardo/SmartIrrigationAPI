"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeterings1646259327448 = void 0;
const typeorm_1 = require("typeorm");
class createMeterings1646259327448 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'meterings',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v1()'
                },
                {
                    name: 'flow_rate',
                    type: 'varchar',
                },
                {
                    name: 'device_id',
                    type: 'varchar'
                },
                {
                    name: 'timeInstant',
                    type: 'varchar'
                },
                {
                    name: 'humidity',
                    type: 'varchar'
                },
                {
                    name: 'humiditySoil',
                    type: 'varchar'
                },
                {
                    name: 'temperature',
                    type: 'varchar'
                },
                {
                    name: 'commandInfo',
                    type: 'boolean'
                }
            ]
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('meterings');
    }
}
exports.createMeterings1646259327448 = createMeterings1646259327448;
