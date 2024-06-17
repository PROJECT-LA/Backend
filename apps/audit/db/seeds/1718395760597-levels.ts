import { Level } from 'apps/audit/src/level/entities'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class Levels1718395760597 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const levels = [
      {
        grade: 1,
        name: 'COBIT-5',
        description: 'COBIT 1 description',
      },
      {
        grade: 2,
        name: 'COBIT-6',
        description: 'COBIT 2 description',
      },
    ]
    const newLevels = levels.map((level) => {
      return new Level({
        grade: level.grade,
        name: level.name,
        description: level.description,
      })
    })
    await queryRunner.manager.save(newLevels)
  }

  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
