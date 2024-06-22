import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateControlGroupDto,
  FilterControlGroupDto,
  STATUS,
  UpdateControlGroupDto,
} from '@app/common'
import { IControlGroupRepository } from '../interface'
import { RpcException } from '@nestjs/microservices'
import { ITemplateRepository } from '../../template/interface'
import { Equal, Like } from 'typeorm'
import { Control } from '../../control/entities'
import { ControlGroup } from '../entities'

@Injectable()
export class ControlGroupService {
  constructor(
    @Inject('IControlGroupRepository')
    private controlRepository: IControlGroupRepository,
    @Inject('ITemplateRepository')
    private templateRepository: ITemplateRepository,
  ) {}

  async getControlById(id: string) {
    const control = await this.controlRepository.findOneByCondition({
      where: { id },
    })
    if (!control)
      throw new RpcException(new NotFoundException('Control no encontrado'))
    return control
  }

  async list(paginationQueryDto: FilterControlGroupDto) {
    const { skip, limit, filter, idTemplate } = paginationQueryDto
    const options = {
      ...(filter && {
        where: [
          {
            objective: Like(`%${filter}%`),
            group: Like(`%${filter}%`),
            groupDescription: Like(`%${filter}%`),
            objectiveDescription: Like(`%${filter}%`),
          },
          { idTemplate: Equal(idTemplate) },
        ],
      }),
      relations: ['controls'],
      skip,
      take: limit,
    }
    return await this.controlRepository.getPaginateItems(options)
  }

  async create(controlDto: CreateControlGroupDto) {
    const template = await this.templateRepository.findOneById(
      controlDto.idTemplate,
    )
    if (!template)
      throw new RpcException(new NotFoundException('Plantilla no encontrada'))

    const newControlGroup = this.controlRepository.create(controlDto)
    return await this.controlRepository.save(newControlGroup)
  }

  async update(id: string, controlDto: UpdateControlGroupDto) {
    await this.getControlById(id)
    return await this.controlRepository.update(id, controlDto)
  }

  async delete(id: string) {
    await this.getControlById(id)
    await this.controlRepository.transactional(async (manager) => {
      await manager.delete(Control, { idControlGroup: id })
      await manager.delete(ControlGroup, { id: id })
    })
  }

  async changeStatus(id: string) {
    const controlGroup = await this.getControlById(id)
    controlGroup.status =
      controlGroup.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE

    return await this.controlRepository.update(id, controlGroup)
  }
}
