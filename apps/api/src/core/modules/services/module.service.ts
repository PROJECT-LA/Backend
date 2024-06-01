import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { ModuleRepositoryInterface } from '../interfaces'
import { CreateModuleDto, UpdateModuleDto } from '../dto'
import { STATUS } from '@app/common'

@Injectable()
export class ModuleService {
  constructor(
    @Inject('IModuleRepository')
    private readonly moduleRepository: ModuleRepositoryInterface,
  ) {}

  async getModule(id: string) {
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
      const module = await this.moduleRepository.create({
        id: moduleDto.idModule,
      })
      console.log(moduleDto.idModule)
      const order = await this.moduleRepository.getModuleOrderBySection(
        moduleDto.idModule,
      )
      console.log('el orden ->>>', order)
      if (!order) newModule.order = 1
      newModule.order = order + 1
      console.log(newModule.order)
      newModule.module = module
    } else {
      const order = await this.moduleRepository.getModuleOrderBySection(
        moduleDto.idRole,
      )
      console.log(order)
      if (!order) newModule.order = 1
      newModule.order = order + 1
    }
    return await this.moduleRepository.save(newModule)
  }

  async update(id: string, moduleDto: UpdateModuleDto) {
    await this.getModule(id)
    return await this.moduleRepository.update(id, moduleDto)
  }

  async delete(id: string) {
    const module = await this.getModule(id)
    console.log(module)
    return await this.moduleRepository.delete(id)
  }

  async changeStatus(id: string) {
    const module = await this.moduleRepository.findOneByCondition({
      where: { id },
      relations: ['subModule'],
    })
    module.status =
      module.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    module.subModule.forEach((subModule) => {
      subModule.status = module.status
    })
    return await this.moduleRepository.save(module)
  }

  async getModulesByRole(id: string) {
    return await this.moduleRepository.getModuleSubModules(id)
  }
}
