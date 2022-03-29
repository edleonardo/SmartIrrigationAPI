import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createMeterings1646259327448 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
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
          },
          {
            name: 'totalFlow',
            type: 'varchar'
          },
          {
            name: 'created_at',
            type: 'int8'
          }
        ]
      })
    )
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('meterings')
  }
}
