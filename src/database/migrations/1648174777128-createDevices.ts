import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createDevices1648174777128 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
      new Table({
        name: 'devices',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'NEWID()'
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
						type: 'varchar'
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
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('devices')
  }
}
