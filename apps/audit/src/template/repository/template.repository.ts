import { Brackets, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Template } from '../entities'
import { ITemplateRepository } from '../interface'
import { FilterTemplateDto } from '@app/common/dto/audit/template'

@Injectable()
export class TemplateRepository
  extends BaseRepository<Template>
  implements ITemplateRepository
{
  constructor(
    @InjectRepository(Template)
    private readonly template: Repository<Template>,
  ) {
    super(template)
  }

  async list(filterDto: FilterTemplateDto) {
    const { limit, order, sense, skip, filter } = filterDto
    const query = this.template
      .createQueryBuilder('template')
      .select([
        'template.id',
        'template.name',
        'template.description',
        'template.status',
        'template.version',
      ])
      .take(limit)
      .skip(skip)

    switch (order) {
      case 'names':
        query.addOrderBy('template.name', sense)
        break
      case 'description':
        query.addOrderBy('template.description', sense)
        break
      case 'version':
        query.addOrderBy('template.version', sense)
        break
      default:
        query.orderBy('template.id', 'ASC')
    }

    if (filter) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('template.name like :filter', { filter: `%${filter}%` })
          qb.orWhere('template.version like :filter', {
            filter: `%${filter}%`,
          })
        }),
      )
    }
    return await query.getManyAndCount()
  }
}
