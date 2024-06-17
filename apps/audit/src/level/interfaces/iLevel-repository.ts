import { BaseInterfaceRepository, FilterTemplateDto } from '@app/common'
import { Level } from '../entities'

export interface ILevelRepository extends BaseInterfaceRepository<Level> {
  list(paginationQueryDto: FilterTemplateDto): Promise<[Level[], number]>
}
