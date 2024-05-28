import { BeforeInsert, Check, Column, Entity } from 'typeorm'
import { ParameterInterface } from '../interface'
import { BaseEntity, STATUS, UtilService } from '@app/common'

@Check(UtilService.buildStatusCheck(STATUS))
@Entity({ name: 'parameters' })
export class Parameter extends BaseEntity implements ParameterInterface {
  @Column({
    length: 15,
    type: 'varchar',
    unique: true,
    comment: 'Código de parámetro',
  })
  code: string

  @Column({ length: 50, type: 'varchar', comment: 'Nombre de parámetro' })
  name: string

  @Column({ length: 15, type: 'varchar', comment: 'Grupo de parámetro' })
  group: string

  @Column({ length: 255, type: 'varchar', comment: 'Descripción de parámetro' })
  description: string

  constructor(data?: Partial<Parameter>) {
    super(data)
  }

  @BeforeInsert()
  insertStatus() {
    this.status = this.status || STATUS.ACTIVE
  }
}
