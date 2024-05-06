import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { CreateModuleDto, FilterModuleDto, UpdateModuleDto } from '../dto'
import { Module } from '../entitites'
import { STATUS } from 'src/common'

@Injectable()
export class ModuleRepository {
  constructor(private dataSource: DataSource) {}

  async findById(id: string) {
    return await this.dataSource
      .getRepository(Module)
      .createQueryBuilder('module')
      .where({ id: id })
      .getOne()
  }

  async findAll(paginacionQueryDto: FilterModuleDto) {
    const { limit, skip, filter, section, order, sense } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Module)
      .createQueryBuilder('module')
      .leftJoin('module.module', 'moduloTypeSection')
      .select([
        'module.id',
        'module.label',
        'module.url',
        'module.name',
        'module.icon',
        'module.description',
        'module.order',
        'module.status',
        'moduloTypeSection.id',
      ])
      .take(limit)
      .skip(skip)

    switch (order) {
      case 'name':
        query.addOrderBy('module.name', sense)
        break
      case 'label':
        query.addOrderBy('module.label', sense)
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
          qb.orWhere('module.label ilike :filter', { filter: `%${filter}%` })
          qb.orWhere('module.name ilike :filter', { filter: `%${filter}%` })
        })
      )
    }
    if (section) {
      query.andWhere('(module.module is null)')
    }
    return await query.getManyAndCount()
  }

  async modulegetModulesSubmodules() {
    return await this.dataSource
      .getRepository(Module)
      .createQueryBuilder('module')
      .leftJoinAndSelect(
        'module.subModule',
        'subModule',
        'subModule.status = :status',
        {
          status: STATUS.ACTIVE,
        }
      )
      .select([
        'module.id',
        'module.label',
        'module.url',
        'module.name',
        'module.icon',
        'module.description',
        'module.order',
        'module.status',
        'subModule.id',
        'subModule.label',
        'subModule.url',
        'subModule.name',
        'subModule.properties',
        'subModule.status',
      ])
      .where('module.id_modulo is NULL')
      .andWhere('module.status = :status', {
        status: STATUS.ACTIVE,
      })
      .orderBy(`"module"."properties"->'order'`, 'ASC')
      .addOrderBy(`"subModule"."properties"->'order'`, 'ASC')
      .getMany()
  }

  async create(moduleDto: CreateModuleDto) {
    const module = new Module({
      label: moduleDto.label,
      url: moduleDto.url,
      name: moduleDto.name,
      icon: moduleDto.properties.icon,
      description: moduleDto.properties.description,
      order: moduleDto.properties.order,
    })

    if (moduleDto.idModule) {
      const em = new Module()
      em.id = moduleDto.idModule
      module.module = em
    }

    return await this.dataSource.getRepository(Module).save(module)
  }

  async update(id: string, moduleDto: UpdateModuleDto) {
    const datosActualizar = new Module({
      ...moduleDto,
    })

    return await this.dataSource
      .getRepository(Module)
      .update(id, datosActualizar)
  }

  async delete(id: string) {
    return await this.dataSource.getRepository(Module).delete(id)
  }
}
