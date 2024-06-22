import { BaseInterfaceEntity } from '@app/common'

export interface IControlGroup extends BaseInterfaceEntity {
  objective: string
  objectiveDescription: string
  objectiveCode: string
  group: string
  groupDescription: string
  groupCode: string
}
