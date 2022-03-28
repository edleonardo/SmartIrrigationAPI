"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser1616343769752 = void 0;
const typeorm_1 = require("typeorm");
class CreateUser1616343769752 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: 'users',
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
                    name: 'password',
                    type: 'varchar'
                },
                {
                    name: 'email',
                    type: 'varchar'
                }
            ]
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable('users');
    }
}
exports.CreateUser1616343769752 = CreateUser1616343769752;
