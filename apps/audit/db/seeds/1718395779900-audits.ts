import { Audit } from '../../src/audit/entities'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class Audits1718395779900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const audits = [
      {
        objective: 'CONTROL DE ACCESOS PRESENCIAL',
        description:
          'EL peronala utiliza algun tipo de credencial al moneto de relaixar n ingreso a las instalaciones',
        beginDate: '2024/01/01',
        finalDate: '2024/05/01',
        idClient: '1',
        idLevel: '1',
        idTemplate: '1',
      },
    ]

    const newControls = audits.map((control) => {
      return new Audit({
        objective: control.objective,
        description: control.description,
        beginDate: new Date(control.beginDate),
        finalDate: new Date(control.finalDate),
        idClient: control.idClient,
        idLevel: control.idLevel,
        idTemplate: control.idTemplate,
      })
    })

    await queryRunner.manager.save(newControls)
  }
  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
