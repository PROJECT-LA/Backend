import { Brackets, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository, STATUS } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ModuleEntity } from '../entities'
import { ModuleRepositoryInterface } from '../interfaces'
import { FilterModuleDto } from '../dto'

@Injectable()
export class ModuleRepository
  extends BaseRepository<ModuleEntity>
  implements ModuleRepositoryInterface
{
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly module: Repository<ModuleEntity>,
  ) {
    super(module)
  }
  async list(filterDto: FilterModuleDto) {
    const { limit, order, sense, skip, filter, section } = filterDto

    const query = this.module
      .createQueryBuilder('module')
      .leftJoin('module.module', 'section')
      .select([
        'module.id',
        'module.title',
        'module.url',
        'module.icon',
        'module.order',
        'module.status',
        'module.description',
        'section.id',
        'section.title',
        'section.order',
      ])

    switch (order) {
      case 'title':
        query.addOrderBy('module.title', sense)
        break
      case 'url':
        query.addOrderBy('module.url', sense)
        break
      case 'status':
        query.addOrderBy('module.status', sense)
        break
      default:
        query.addOrderBy('module.id', 'ASC')
    }

    if (filter) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('module.title like :filter', { filter: `%${filter}%` })
        }),
      )
    }
    if (section) {
      query.andWhere('(module.module is null)')
    }

    query.skip(skip).take(limit)

    return await query.getManyAndCount()
  }

  async getModuleSubModules(id: string) {
    return await this.module
      .createQueryBuilder('module')
      .leftJoinAndSelect(
        'module.subModule',
        'subModule',
        'subModule.status = :status',
        {
          status: STATUS.ACTIVE,
        },
      )
      .select([
        'module.id',
        'module.title',
        'module.description',
        'module.status',
        'module.order',
        'module.idRole',
        'subModule.id',
        'subModule.title',
        'subModule.url',
        'subModule.order',
        'subModule.icon',
        'subModule.status',
        'subModule.idRole',
      ])
      .where('module.module is NULL')
      .andWhere('module.idRole = :idRole', { idRole: id })
      .orderBy('module.order', 'ASC')
      .addOrderBy('subModule.order', 'ASC')
      .getMany()
  }
}
