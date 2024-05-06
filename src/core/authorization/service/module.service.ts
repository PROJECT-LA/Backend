import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateModuleDto, FilterModuleDto, UpdateModuleDto } from '../dto'
import { STATUS } from 'src/common'
import { ModuleRepository } from '../repository'
@Injectable()
export class ModuleService {
  constructor(
    @Inject(ModuleRepository)
    private moduleRepository: ModuleRepository
  ) {}

  async findAll(paginacionQueryDto: FilterModuleDto) {
    return await this.moduleRepository.findAll(paginacionQueryDto)
  }

  async findAllModules() {
    return await this.moduleRepository.modulegetModulesSubmodules()
  }

  async create(moduloDto: CreateModuleDto) {
    return await this.moduleRepository.create(moduloDto)
  }

  async update(id: string, moduloDto: UpdateModuleDto) {
    return await this.moduleRepository.update(id, moduloDto)
  }

  async delete(id: string) {
    return await this.moduleRepository.delete(id)
  }

  async activate(id: string) {
    const module = await this.moduleRepository.findById(id)
    if (!module) {
      throw new NotFoundException('CAMBIAR')
    }

    const updateModule = new UpdateModuleDto()
    updateModule.status = STATUS.ACTIVE

    await this.moduleRepository.update(id, updateModule)

    return {
      id,
    }
  }

  async inactivate(id: string) {
    const module = await this.moduleRepository.findById(id)
    if (!module) {
      throw new NotFoundException('CAMBIAR')
    }

    const updateModule = new UpdateModuleDto()
    updateModule.status = STATUS.INACTIVE

    await this.moduleRepository.update(id, updateModule)

    return {
      id,
    }
  }
}
