import { Inject, Injectable, NotFoundException } from '@nestjs/common'

import { STATUS } from '@app/common'
import { IControlRepository } from '../interface'
import {
  CreateControlDto,
  FilterControlDto,
  UpdateControlDto,
} from '@app/common/dto/audit/control'

@Injectable()
export class ControlService {
  constructor(
    @Inject('IControlRepository')
    private readonly controlRepository: IControlRepository,
  ) {}

  async getControlById(id: string) {
    const control = await this.controlRepository.findOneByCondition({
      where: { id },
    })
    if (!control) throw new NotFoundException('Control no encontrado')
    return control
  }

  async list(id: string, filterDto: FilterControlDto) {
    return await this.controlRepository.list(id, filterDto)
  }

  async create(controlDto: CreateControlDto) {
    const newModule = this.controlRepository.create(controlDto)
    console.log(newModule)
    return await this.controlRepository.save(newModule)
  }

  async update(id: string, controlDto: UpdateControlDto) {
    await this.getControlById(id)
    return await this.controlRepository.update(id, controlDto)
  }

  async delete(id: string) {
    await this.getControlById(id)
    return await this.controlRepository.delete(id)
  }

  async changeStatus(id: string) {
    const module = await this.controlRepository.findOneByCondition({
      where: { id },
      relations: ['subModule'],
    })
    module.status =
      module.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE

    return await this.controlRepository.save(module)
  }
}
