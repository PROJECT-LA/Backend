import { Brackets, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ControlGroup } from '../entities'
import { FilterControlGroupDto } from '@app/common/dto/audit/control-group'
import { ControlGroupRepositoryInterface } from '../interface'

@Injectable()
export class ControlGroupRepository
  extends BaseRepository<ControlGroup>
  implements ControlGroupRepositoryInterface
{
  constructor(
    @InjectRepository(ControlGroup)
    private readonly control: Repository<ControlGroup>,
  ) {
    super(control)
  }

  async list(filterDto: FilterControlGroupDto) {
    const { limit, skip, filter, idTemplate } = filterDto
    console.log(filterDto)
    const query = this.control
      .createQueryBuilder('controlGroup')
      .leftJoinAndSelect('controlGroup.controls', 'controls')
      .select([
        'controlGroup.id',
        'controlGroup.objective',
        'controlGroup.objectiveDescription',
        'controlGroup.objectiveCode',
        'controlGroup.group',
        'controlGroup.groupDescription',
        'controlGroup.groupCode',
        'controlGroup.status',
        'controls.name',
        'controls.description',
        'controls.code',
      ])
      .where('controlGroup.idTemplate = :idTemplate', { idTemplate })
      .take(limit)
      .skip(skip)

    if (filter) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('controlGroup.objective like :filter', {
            filter: `%${filter}%`,
          })
          qb.orWhere('controlGroup.group like :filter', {
            filter: `%${filter}%`,
          })
          qb.orWhere('controlGroup.groupDescription like :filter', {
            filter: `%${filter}%`,
          })
          qb.orWhere('controlGroup.objectiveDescription like :filter', {
            filter: `%${filter}%`,
          })
        }),
      )
    }

    return await query.getManyAndCount()
  }
}
