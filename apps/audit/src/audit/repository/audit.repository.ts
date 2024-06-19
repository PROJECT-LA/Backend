import { Brackets, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository, FilterAuditDto } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Audit } from '../entities'
import { IAuditRepository } from '../interface'

@Injectable()
export class AuditRepository
  extends BaseRepository<Audit>
  implements IAuditRepository
{
  constructor(
    @InjectRepository(Audit)
    private readonly audit: Repository<Audit>,
  ) {
    super(audit)
  }

  async list(filterDto: FilterAuditDto) {
    const { limit, skip, filter, idClient } = filterDto
    const query = this.audit
      .createQueryBuilder('audit')
      .select([
        'audit.objective',
        'audit.description',
        'audit.beginDate',
        'audit.finalDate',
        'audit.idClient',
        'audit.idTemplate',
        'audit.status',
        'audit.idLevel',
        'audit.acceptanceLevel',
        'audit.id',
      ])
      .where('audit.idClient = :idClient', { idClient })
      .take(limit)
      .skip(skip)

    if (filter) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('audit.objective like :filter', {
            filter: `%${filter}%`,
          })
          qb.orWhere('audit.description like :filter', {
            filter: `%${filter}%`,
          })
        }),
      )
    }

    return await query.getManyAndCount()
  }
}
