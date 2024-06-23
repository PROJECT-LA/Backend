/* import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { Assessment } from '../../assessment/entity'

@Entity({ name: 'ResultadosControles' })
export class Result {
  @ManyToOne(() => Evaluacion)
  idAssessment: Assessment

  @ManyToOne(() => ControlEspecifico)
  id_control_especifico: ControlEspecifico

  @Column()
  cumple: boolean
}
 */
