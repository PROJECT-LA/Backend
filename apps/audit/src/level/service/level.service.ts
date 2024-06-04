import { Inject, Injectable, PreconditionFailedException } from '@nestjs/common'
import { FilterTemplateDto, Messages, STATUS } from '@app/common'
import { ILevelRepository } from '../interfaces'
import { CreateLevelDto, UpdateLevelDto } from '@app/common/dto/audit/level'

@Injectable()
export class LevelService {
  constructor(
    @Inject('ILevelRepository')
    private readonly levelRepository: ILevelRepository,
  ) {}

  async getLevelById(id: string) {
    const level = await this.levelRepository.findOneById(id)
    if (!level)
      throw new PreconditionFailedException(Messages.EXCEPTION_ROLE_NOT_FOUND)
    return level
  }

  async create(createTemplateDto: CreateLevelDto) {
    const newRole = this.levelRepository.create(createTemplateDto)
    return await this.levelRepository.save(newRole)
  }

  async update(id: string, updateLevelDto: UpdateLevelDto) {
    await this.getLevelById(id)
    return await this.levelRepository.update(id, updateLevelDto)
  }

  async delete(id: string) {
    await this.getLevelById(id)
    return await this.levelRepository.delete(id)
  }

  async list(paginationQueryDto: FilterTemplateDto) {
    return await this.levelRepository.list(paginationQueryDto)
  }

  async changeTemplateState(idTemplate: string) {
    const level = await this.levelRepository.findOneById(idTemplate)
    const newStatus =
      level.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    await this.levelRepository.update(idTemplate, { status: newStatus })
  }
}
