import { Brackets, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Control } from '../entities'
import { FilterControlDto } from '@app/common/dto/audit/control'
import { IControlRepository } from '../interface'

@Injectable()
export class ControlRepository
  extends BaseRepository<Control>
  implements IControlRepository
{
  constructor(
    @InjectRepository(Control)
    private readonly control: Repository<Control>,
  ) {
    super(control)
  }

  async list(filterDto: FilterControlDto) {
    const { limit, order, sense, skip, filter, idTemplate } = filterDto
    console.log(filterDto)
    const query = this.control
      .createQueryBuilder('control')
      .select([
        'control.id',
        'control.oControl',
        'control.oControlDescription',
        'control.oControlCode',
        'control.gControl',
        'control.gControlDescription',
        'control.gControlCode',
        'control.eControl',
        'control.eControlDescription',
        'control.eControlCode',
        'control.status',
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
