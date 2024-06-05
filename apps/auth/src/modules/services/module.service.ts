import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { IModuleRepository } from '../interfaces'
import { CreateModuleDto, NewOrderDto, UpdateModuleDto } from '../dto'
import { STATUS } from '@app/common'
import { ModuleEntity } from '../entities'

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
    if (!module) throw new NotFoundException('Modulo no encontrado')
    return module
  }

  async create(moduleDto: CreateModuleDto) {
    const newModule = this.moduleRepository.create(moduleDto)
    if (moduleDto.idModule) {
      const module = this.moduleRepository.create({
        id: moduleDto.idModule,
      })
      const order = await this.moduleRepository.getModuleOrderBySection(
        moduleDto.idModule,
      )
      if (!order) newModule.order = 1
      newModule.order = order + 1
      newModule.module = module
    } else {
      const order = await this.moduleRepository.getOrderSectionByRole(
        moduleDto.idRole,
      )
      if (!order) newModule.order = 1
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
    return await this.moduleRepository.getModuleSubModules(id)
  }
}
