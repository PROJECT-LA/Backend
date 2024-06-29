import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateControlDto,
  FilterControlDto,
  STATUS,
  UpdateControlDto,
} from '@app/common'
import { IControlRepository } from '../interface'
import { Equal, FindManyOptions, Like } from 'typeorm'
import { IControlGroupRepository } from '../../group-control/interface'
import { RpcException } from '@nestjs/microservices'
import { Control } from '../entities'

@Injectable()
export class ControlService {
  constructor(
    @Inject('IControlRepository')
    private controlRepository: IControlRepository,
    @Inject('IControlGroupRepository')
    private controlGroupRepository: IControlGroupRepository,
  ) {}

  async getControlById(id: string) {
    const control = await this.controlRepository.findOneByCondition({
      where: { id },
    })
    if (!control) throw new NotFoundException('Control no encontrado')
    return control
  }

  async list(paginationQueryDto: FilterControlDto) {
    const { skip, limit, filter, idControlGroup } = paginationQueryDto
    const options: FindManyOptions<Control> = {
      where: [
        {
          idControlGroup: Equal(idControlGroup),
          name: Like(`%${filter}%`),
        },
        {
          idControlGroup: Equal(idControlGroup),
          description: Like(`%${filter}%`),
        },
      ],
      skip,
      take: limit,
    }
    return await this.controlRepository.getPaginateItems(options)
  }

  async create(controlDto: CreateControlDto) {
    const newModule = this.controlRepository.create(controlDto)
    const controlGroup = await this.controlGroupRepository.findOneById(
      controlDto.idControlGroup,
    )
    if (!controlGroup) {
      throw new RpcException(
        new NotFoundException('Grupo de control no encontrado'),
      )
    }

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
    const control = await this.controlRepository.findOneByCondition({
      where: { id },
    })
    control.status =
      control.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE

    return await this.controlRepository.save(control)
  }
}
