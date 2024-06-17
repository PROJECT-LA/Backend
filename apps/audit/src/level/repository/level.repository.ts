import { Brackets, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'

import { ILevelRepository } from '../interfaces'
import { FilterLevelDto } from '@app/common/dto/audit/level'
import { Level } from '../entities'

@Injectable()
export class LevelRepository
  extends BaseRepository<Level>
  implements ILevelRepository
{
  constructor(
    @InjectRepository(Level)
    private readonly level: Repository<Level>,
  ) {
    super(level)
  }

  async list(filterDto: FilterLevelDto) {
    const { limit, skip, filter } = filterDto
    const query = this.level
      .createQueryBuilder('level')
      .select([
        'level.id',
        'level.name',
        'level.grade',
        'level.description',
        'level.status',
      ])
      .take(limit)
      .skip(skip)

    if (filter) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('level.name like :filter', {
            filter: `%${filter}%`,
          })
        }),
      )
    }
    return await query.getManyAndCount()
  }
}
