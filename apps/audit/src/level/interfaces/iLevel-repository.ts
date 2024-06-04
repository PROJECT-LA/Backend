import { BaseInterfaceRepository, FilterTemplateDto } from '@app/common'
import { MaturityLevel } from '../entities'

export interface ILevelRepository
  extends BaseInterfaceRepository<MaturityLevel> {
  list(
    paginationQueryDto: FilterTemplateDto,
  ): Promise<[MaturityLevel[], number]>
}
