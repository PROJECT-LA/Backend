import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository, STATUS } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ModuleEntity } from '../entities'
import { IModuleRepository } from '../interfaces'

@Injectable()
export class ModuleRepository
  extends BaseRepository<ModuleEntity>
  implements IModuleRepository
{
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly module: Repository<ModuleEntity>,
  ) {
    super(module)
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

  async getOrderSectionByRole(id: string) {
    const order = await this.module
      .createQueryBuilder('module')
      .select('MAX(module.order)', 'max')
      .where('module.module is NULL')
      .andWhere('module.idRole = :idRole', { idRole: id })
      .getRawOne()
    return order.max
  }

  async getModuleOrderBySection(id: string) {
    const query = await this.module
      .createQueryBuilder('module')
      .select('MAX(module.order)', 'max')
      .where('module.idModule = :module', { module: id })
      .getRawOne()
    return query.max
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
}
