import { Inject, Injectable, PreconditionFailedException } from '@nestjs/common'
import {
  CreateTemplateDto,
  FilterTemplateDto,
  Messages,
  STATUS,
  UpdateTemplateDto,
} from '@app/common'
import { ITemplateRepository } from '../interface'

@Injectable()
export class TemplateService {
  constructor(
    @Inject('ITemplateRepository')
    private readonly templateRepository: ITemplateRepository,
  ) {}

  async getTemplateById(id: string) {
    const template = await this.templateRepository.findOneById(id)
    if (!template)
      throw new PreconditionFailedException(Messages.EXCEPTION_ROLE_NOT_FOUND)
    return template
  }

  async create(createTemplateDto: CreateTemplateDto) {
    const newRole = this.templateRepository.create(createTemplateDto)
    return await this.templateRepository.save(newRole)
  }

  async update(id: string, updateRoleDto: UpdateTemplateDto) {
    await this.getTemplateById(id)
    return await this.templateRepository.update(id, updateRoleDto)
  }

  async delete(id: string) {
    await this.getTemplateById(id)
    return await this.templateRepository.delete(id)
  }

  async list(paginationQueryDto: FilterTemplateDto) {
    return await this.templateRepository.list(paginationQueryDto)
  }

  async changeTemplateState(idTemplate: string) {
    const template = await this.templateRepository.findOneById(idTemplate)
    const newStatus =
      template.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    await this.templateRepository.update(idTemplate, { status: newStatus })
  }
}
