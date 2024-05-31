import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository, STATUS } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ModuleEntity } from '../entities'
import { ModuleRepositoryInterface } from '../interfaces'

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
  async getModuleSubModules(id: string) {
    return await this.module
      .createQueryBuilder('module')
      .leftJoinAndSelect('module.subModule', 'subModule')
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

  async getSidebarByRole(id: string) {
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
      .andWhere('module.status = :status', {
        status: STATUS.ACTIVE,
      })
      .andWhere('module.idRole = :idRole', { idRole: id })
      .orderBy('module.order', 'ASC')
      .addOrderBy('subModule.order', 'ASC')
      .getMany()
  }
}
