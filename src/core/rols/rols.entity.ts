/* import { BeforeInsert, Check, Column, Entity } from 'typeorm'
import { BaseEntity } from 'src/common/config/base.entity'
import { IRol } from 'src/common/interfaces/rol.interface'
import { STATUS } from 'src/common/constants'
import { UtilService } from 'src/common/config/util.service'

@Check(UtilService.buildStatusCheck(STATUS))
@Entity({ name: 'roles', schema: process.env.DB_SCHEMA_USUARIOS })
export class Rol extends BaseEntity implements IRol {
  @Column({
    length: 50,
    type: 'varchar',
    unique: true,
  })
  nombre: string

  @BeforeInsert()
  insertarEstado() {
    this.estado = this. || STATUS.ACTIVE
  }
}
 */
