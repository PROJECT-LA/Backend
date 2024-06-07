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
    const { limit, order, sense, skip, filter, idTemplate } = filterDto
    console.log(filterDto)
    const query = this.control
      .createQueryBuilder('control_group')
      .leftJoinAndSelect('control_group.controls', 'controls')
      .select([
        'control_group.id',
        'control_group.objectiveControl',
        'control_group.objectiveDescription',
        'control_group.objectiveCode',
        'control_group.groupControl',
        'control_group.groupDescription',
        'control_group.groupCode',
        'control_group.status',
        'controls.eCode',
        'controls.eDescription',
        'controls.eControl',
      ])
      .where('control.idTemplate = :idTemplate', { idTemplate })
      .take(limit)
      .skip(skip)

    switch (order) {
      case 'oControl':
        query.addOrderBy('control.oControl', sense)
        break
      case 'gControl':
        query.addOrderBy('control.gControl', sense)
        break
      case 'eControl':
        query.addOrderBy('control.eControl', sense)
        break
      default:
        query.orderBy('control.id', 'ASC')
    }

    if (filter) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('control.oControl like :filter', { filter: `%${filter}%` })
          qb.orWhere('control.gControl like :filter', {
            filter: `%${filter}%`,
          })
          qb.orWhere('control.eControl like :filter', {
            filter: `%${filter}%`,
          })
        }),
      )
    }

    return await query.getManyAndCount()
  }
}
