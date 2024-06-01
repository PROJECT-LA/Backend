import { BaseEntity, STATUS, UtilService } from '@app/common'
import {
  BeforeInsert,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import { IModule } from '../interfaces'
import { Role } from '../../roles/entities'

@Check(UtilService.buildStatusCheck(STATUS))
@Entity({ name: 'modules' })
export class ModuleEntity extends BaseEntity implements IModule {
  @Column({
    length: 50,
    type: 'varchar',
    comment: 'Etiqueta del módulo para el Sidebar del proyecto',
  })
  title: string

  @Column({
    length: 250,
    type: 'varchar',
    comment: 'Ruta para acceder al módulo',
  })
  description: string

  @Column({
    length: 50,
    type: 'varchar',
    comment: 'Icono del módulo',
    nullable: true,
  })
  icon: string | null

  @Column({
    type: 'int',
    comment: 'Orden del modulo en el sidebar',
  })
  order: number

  @Column({
    length: 50,
    type: 'varchar',
    comment: 'Ruta para acceder al módulo',
    nullable: true,
  })
  url?: string | null

  @Column({
    type: 'bigint',
    nullable: false,
    comment: 'Clave foránea de la reacion con el rol',
  })
  idRole: string

  @ManyToOne(() => Role, (role) => role.modules)
  @JoinColumn({ name: 'id_role', referencedColumnName: 'id' })
  role: Role

  @Column({
    type: 'bigint',
    nullable: true,
    comment: 'Clave foránea del módulo padre',
  })
  idModule?: string | null

  @OneToMany(() => ModuleEntity, (module) => module.module, { cascade: true })
  subModule: ModuleEntity[]

  @ManyToOne(() => ModuleEntity, (module) => module.subModule, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_module', referencedColumnName: 'id' })
  module: ModuleEntity

  constructor(data?: Partial<ModuleEntity>) {
    super(data)
  }

  @BeforeInsert()
  insertarEstado() {
    this.status = this.status || STATUS.ACTIVE
  }
}
