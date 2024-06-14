import { ControlGroup } from '../../src/group-control/entities'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class ControlGroups1718395776156 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const controlGroups = [
      {
        objective: 'AYUDAR CON CONTROL DE ACCESOS',
        description:
          'CONTROL QUE PERMITE EL ACCESO A LOS RECURSOS DE INFORMACIÓN Y APLICACIONES DE ACUERDO A LOS PRIVILEGIOS ASIGNADOS',
        code: 'C-12',
        group: 'CONTROLES DE ACCESOS',
        groupDescription:
          'CONTROL QUE PERMITE EL ACCESO A LOS RECURSOS DE INFORMACIÓN Y APLICACIONES DE ACUERDO A LOS PRIVILEGIOS ASIGNADOS',
        groupCode: 'CA-123',
        idTemplate: '1',
      },
    ]
    const newControlGroups = controlGroups.map((controlGroup) => {
      return new ControlGroup({
        objective: controlGroup.objective,
        objectiveDescription: controlGroup.description,
        objectiveCode: controlGroup.code,
        group: controlGroup.group,
        groupDescription: controlGroup.groupDescription,
        groupCode: controlGroup.groupCode,
        idTemplate: controlGroup.idTemplate,
      })
    })
    await queryRunner.manager.save(newControlGroups)
  }

  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
