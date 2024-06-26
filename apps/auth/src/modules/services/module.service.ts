import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { IModuleRepository } from '../interfaces'
import {
  CreateModuleDto,
  NewOrderDto,
  UpdateModuleDto,
  STATUS,
} from '@app/common'
import { ModuleEntity } from '../entities'
import { RpcException } from '@nestjs/microservices'
import { Equal, Not } from 'typeorm'

@Injectable()
export class ModuleService {
  constructor(
    @Inject('IModuleRepository')
    private readonly moduleRepository: IModuleRepository,
  ) {}

  async getModuleById(id: string) {
    const module = await this.moduleRepository.findOneByCondition({
      where: { id },
      relations: ['subModule'],
    })
    if (!module) {
      throw new RpcException(new NotFoundException('Modulo no encontrado'))
    }
    return module
  }

  async create(moduleDto: CreateModuleDto) {
    const newModule = this.moduleRepository.create(moduleDto)
    if (moduleDto.idModule) {
      const module = this.moduleRepository.create({
        id: moduleDto.idModule,
      })
      const order = await this.getModulesOrderBySection(moduleDto.idModule)
      newModule.order = order + 1
      newModule.module = module
    } else {
      const order = await this.getSectionOrderByRole(moduleDto.idRole)
      newModule.order = order + 1
    }
    return await this.moduleRepository.save(newModule)
  }

  async update(id: string, moduleDto: UpdateModuleDto) {
    await this.getModuleById(id)
    return await this.moduleRepository.update(id, moduleDto)
  }

  async delete(id: string) {
    await this.getModuleById(id)
    return await this.moduleRepository.delete(id)
  }

  async changeStatus(id: string) {
    const module = await this.moduleRepository.findOneByCondition({
      where: { id },
      relations: ['subModule'],
    })
    module.status =
      module.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    if (module.subModule) {
      module.subModule.forEach((subModule) => {
        subModule.status = module.status
      })
    }
    return await this.moduleRepository.save(module)
  }

  async updateOrder(newOrder: NewOrderDto) {
    const { data } = newOrder
    const updatedModules: ModuleEntity[] = []

    for (const moduleData of data) {
      const module = await this.moduleRepository.preload({
        id: moduleData.id,
      })
      if (module) {
        module.subModule = []
        if (moduleData.subModules) {
          for (const subModuleData of moduleData.subModules) {
            const existingSubModule = await this.moduleRepository.preload({
              id: subModuleData.id,
            })
            if (existingSubModule) {
              existingSubModule.order = parseInt(subModuleData.order)
              module.subModule.push(existingSubModule)
            }
          }
        }
        module.order = parseInt(moduleData.order)
        updatedModules.push(module)
      }
    }
    await this.moduleRepository.saveMany(updatedModules)
  }

  async getModulesByRole(id: string) {
    return await this.moduleRepository.findManyByConditions({
      where: {
        module: {
          idRole: id,
          module: Not(null),
        },
      },
      select: {
        module: {
          id: true,
          title: true,
          description: true,
          status: true,
          order: true,
          idRole: true,
          subModule: {
            id: true,
            title: true,
            url: true,
            order: true,
            icon: true,
            status: true,
            idRole: true,
          },
        },
      },
      relations: { subModule: true },
      order: { order: 'ASC', subModule: { order: 'ASC' } },
    })
  }

  async getSectionOrderByRole(id: string) {
    const result = await this.moduleRepository.findOneByCondition({
      where: {
        module: {
          idRole: id,
          module: Equal(null),
        },
      },
      order: { order: 'DESC' },
    })
    return result ? result.order : 0
  }

  async getModulesOrderBySection(id: string) {
    const result = await this.moduleRepository.findOneByCondition({
      where: {
        module: {
          idModule: id,
        },
      },
      order: { order: 'DESC' },
    })
    return result ? result.order : 0
  }
}
