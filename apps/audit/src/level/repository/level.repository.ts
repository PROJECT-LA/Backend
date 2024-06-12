import { Brackets, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MaturityLevel } from '../entities'
import { ILevelRepository } from '../interfaces'
import { FilterLevelDto } from '@app/common/dto/audit/level'

@Injectable()
export class LevelRepository
  extends BaseRepository<MaturityLevel>
  implements ILevelRepository
{
  constructor(
    @InjectRepository(MaturityLevel)
    private readonly level: Repository<MaturityLevel>,
  ) {
    super(level)
  }

  async list(filterDto: FilterLevelDto) {
    const { limit, order, sense, skip, filter } = filterDto
    const query = this.level
      .createQueryBuilder('maturity_level')
      .select([
        'maturity_level.id',
        'maturity_level.level',
        'maturity_level.description',
        'maturity_level.status',
      ])
      .take(limit)
      .skip(skip)

    switch (order) {
      case 'level':
        query.addOrderBy('maturity_level.level', sense)
        break
      case 'description':
        query.addOrderBy('maturity_level.description', sense)
        break
      default:
        query.orderBy('maturity_level.id', 'ASC')
    }

    if (filter) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('maturity_level.level like :filter', {
            filter: `%${filter}%`,
          })
        }),
      )
    }
    return await query.getManyAndCount()
  }
}
