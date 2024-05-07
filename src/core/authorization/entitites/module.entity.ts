import { UtilService } from '../../../common/lib/util.service'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { BaseEntity, STATUS } from 'src/common'

@Check(UtilService.buildStatusCheck(STATUS))
@Entity({ name: 'modules' })
export class Module extends BaseEntity {
  @Column({
    length: 50,
    type: 'varchar',
    comment: 'Etiqueta del módulo para el Sidebar del proyecto',
  })
  label: string

  @Column({
    length: 50,
    type: 'varchar',
    unique: true,
    comment: 'Ruta para acceder al módulo',
  })
  url: string

  @Column({ length: 50, type: 'varchar', comment: 'Nombre del módulo' })
  name: string

  @Column({
    length: 50,
    type: 'varchar',
    comment: 'Icono del modulo',
    nullable: true,
  })
  icon?: string

  @Column({
    length: 50,
    type: 'varchar',
    comment: 'Descripcion del modulo',
  })
  description?: string

  @Column({
    comment: 'Ruta para acceder al módulo',
  })
  order: number

  @Column({
    name: 'id_module',
    type: 'bigint',
    nullable: true,
    comment: 'Clave foránea que índica que pertenece a otro módulo',
  })
  idModule?: string | null

  @OneToMany(() => Module, (module) => module.module)
  subModules: Module[]

  @ManyToOne(() => Module, (module) => module.subModules)
  @JoinColumn({ name: 'id_module', referencedColumnName: 'id' })
  module: Module

  constructor(data?: Partial<Module>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}
