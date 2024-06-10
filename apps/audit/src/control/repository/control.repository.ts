import { Brackets, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository, FilterControlDto } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Control } from '../entities'
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
    const { limit, skip, filter, idControlGroup } = filterDto
    const query = this.control
      .createQueryBuilder('control')
      .select([
        'control.name',
        'control.description',
        'control.code',
        'control.status',
      ])
      .where('control.idControlGroup = :idControlGroup', { idControlGroup })
      .take(limit)
      .skip(skip)

    if (filter) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('control.name like :filter', {
            filter: `%${filter}%`,
          })
          qb.orWhere('control.description like :filter', {
            filter: `%${filter}%`,
          })
        }),
      )
    }

    return await query.getManyAndCount()
  }
}
