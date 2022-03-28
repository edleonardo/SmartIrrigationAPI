import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUser1616343769752 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'NEWID()'
          },
          {
            name: 'nome',
            type: 'varchar',
          },
          {
            name: 'senha',
            type: 'varchar'
          },
          {
            name: 'email',
            type: 'varchar'
          }
        ]
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users')
  }

}
