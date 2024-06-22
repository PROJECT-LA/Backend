import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { STATUS } from '@app/common'
import { ILevelRepository } from '../interfaces'
import {
  CreateLevelDto,
  FilterLevelDto,
  UpdateLevelDto,
} from '@app/common/dto/audit/level'
import { RpcException } from '@nestjs/microservices'
import { Like } from 'typeorm'

@Injectable()
export class LevelService {
  constructor(
    @Inject('ILevelRepository')
    private readonly levelRepository: ILevelRepository,
  ) {}

  async getLevelById(id: string) {
    const level = await this.levelRepository.findOneById(id)
    if (!level)
      throw new RpcException(new NotFoundException('Nivel no encontrado'))
    return level
  }

  async create(createTemplateDto: CreateLevelDto) {
    const newRole = this.levelRepository.create(createTemplateDto)
    await this.Validate(newRole.name)
    return await this.levelRepository.save(newRole)
  }

  async update(id: string, updateLevelDto: UpdateLevelDto) {
    await this.getLevelById(id)
    const updateRole = this.levelRepository.create(updateLevelDto)
    await this.Validate(updateRole.name, id)
    return await this.levelRepository.update(id, updateLevelDto)
  }

  async delete(id: string) {
    await this.getLevelById(id)
    return await this.levelRepository.delete(id)
  }

  async list(paginationQueryDto: FilterLevelDto) {
    const { skip, limit, filter } = paginationQueryDto
    const options = {
      ...(filter && {
        where: { name: Like(`%${filter}%`), description: Like(`%${filter}%`) },
      }),
      skip,
      take: limit,
    }
    return await this.levelRepository.getPaginateItems(options)
  }

  async changeLevelState(idTemplate: string) {
    const level = await this.levelRepository.findOneById(idTemplate)
    const newStatus =
      level.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    await this.levelRepository.update(idTemplate, { status: newStatus })
  }

  async Validate(name: string, id?: string) {
    const level = await this.levelRepository.findOneByCondition({
      where: { name },
    })
    if (level && (id === undefined || level.id !== id)) {
      throw new RpcException(
        new ConflictException('Ya existe un nivel con ese nombre'),
      )
    }
    return true
  }
}
