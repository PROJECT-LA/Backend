import { BaseInterfaceEntity } from '@app/common'

export interface ITemplate extends BaseInterfaceEntity {
  name: string
  description: string
  version: string
}
