import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'
import { Audit } from '../../audits/entities/audit.entity'
import { Template } from '../../template/entities'
import { Control } from '../../control/entities'

@Entity('seguimiento')
export class Seguimiento {
  @PrimaryGeneratedColumn()
  id_seguimiento: number

  @ManyToOne(() => Audit)
  @JoinColumn({ name: 'id_audit' })
  audit: Audit

  @ManyToOne(() => Template)
  @JoinColumn({ name: 'id_template' })
  template: Template

  @ManyToOne(() => Control)
  @JoinColumn({ name: 'id_control' })
  control: Control
}
