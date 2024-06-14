import { MaturityLevel } from 'apps/audit/src/level/entities'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class Levels1718395760597 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const levels = [
      {
        level: 1,
        description: 'Level 1 description',
      },
      {
        level: 2,
        description: 'Level 2 description',
      },
    ]
    const newLevels = levels.map((level) => {
      return new MaturityLevel({
        level: level.level,
        description: level.description,
      })
    })
    await queryRunner.manager.save(newLevels)
  }

  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
