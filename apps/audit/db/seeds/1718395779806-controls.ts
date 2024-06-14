import { Control } from 'apps/audit/src/control/entities'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class Controls1718395779806 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const controls = [
      {
        name: 'CONTROL DE ACCESOS PRESENCIAL',
        description:
          'EL peronala utiliza algun tipo de credencial al moneto de relaixar n ingreso a las instalaciones',
        code: 'CA-1',
      },
      {
        name: 'CONTROL DE ACCESOS REMOTO',
        description:
          'EL personal utiliza algun tipo de credencial al momento de realizar un ingreso a las instalaciones',
        code: 'CA-2',
      },
      {
        name: 'CONTROL DE ACCESOS A SISTEMAS',
        description:
          'EL personal utiliza algun tipo de credencial al momento de realizar un ingreso a las instalaciones',
        code: 'CA-3',
      },
    ]

    const newControls = controls.map((control) => {
      return new Control({
        name: control.name,
        description: control.description,
        code: control.code,
        idControlGroup: '1',
      })
    })

    await queryRunner.manager.save(newControls)
  }
  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
