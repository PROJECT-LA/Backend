import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateControlGroupDto,
  FilterControlGroupDto,
  STATUS,
  UpdateControlGroupDto,
} from '@app/common'
import { ControlGroupRepositoryInterface } from '../interface'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class ControlGroupService {
  constructor(
    @Inject('IControlGroupRepository')
    private controlRepository: ControlGroupRepositoryInterface,
  ) {}

  async getControlById(id: string) {
    const control = await this.controlRepository.findOneByCondition({
      where: { id },
    })
    if (!control)
      throw new RpcException(new NotFoundException('Control no encontrado'))
    return control
  }

  async list(filterDto: FilterControlGroupDto) {
    return await this.controlRepository.list(filterDto)
  }

  async create(controlDto: CreateControlGroupDto) {
    const newModule = this.controlRepository.create(controlDto)
    console.log(newModule)
    return await this.controlRepository.save(newModule)
  }

  async update(id: string, controlDto: UpdateControlGroupDto) {
    await this.getControlById(id)
    return await this.controlRepository.update(id, controlDto)
  }

  async delete(id: string) {
    await this.getControlById(id)
    return await this.controlRepository.delete(id)
  }

  async changeStatus(id: string) {
    const controlGroup = await this.getControlById(id)
    controlGroup.status =
      controlGroup.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE

    return await this.controlRepository.update(id, controlGroup)
  }
}
