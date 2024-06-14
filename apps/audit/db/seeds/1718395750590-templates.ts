import { Template } from '../../src/template/entities'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class Template1718395750590 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const templates = [
      {
        name: 'Template 1',
        description: 'Template 1 description',
        version: '20',
      },
      {
        name: 'Template 2',
        description: 'Template 2 description',
        version: '10',
      },
    ]
    const newTemplates = templates.map((template) => {
      return new Template({
        name: template.name,
        description: template.description,
        version: template.version,
      })
    })
    await queryRunner.manager.save(newTemplates)
  }

  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
