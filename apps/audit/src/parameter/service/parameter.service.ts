import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import {
  CreateParameterDto,
  PaginationQueryDto,
  STATUS,
  UpdateParameterDto,
} from '@app/common'
import { MessagesParameter } from '../constant'
import { ParameterRepositoryInterface } from '../interface'

@Injectable()
export class ParameterService {
  constructor(
    @Inject('IParameterRepository')
    private parameterRepository: ParameterRepositoryInterface,
  ) {}

  async create(parameterDto: CreateParameterDto) {
    const code = await this.parameterRepository.findOneByCondition({
      where: { code: parameterDto.code },
    })

    if (code) throw new ConflictException(MessagesParameter.ALREADY_EXISTS)
    const newParameter = this.parameterRepository.create(parameterDto)
    return await this.parameterRepository.save(newParameter)
  }

  async findOne(id: string) {
    const parameter = await this.parameterRepository.findOneById(id)
    if (!parameter) {
      throw new NotFoundException(MessagesParameter.NOT_FOUND)
    }
    return parameter
  }

  async list(paginationQueryDto: PaginationQueryDto) {
    return await this.parameterRepository.list(paginationQueryDto)
  }

  async findByGroup(group: string) {
    return await this.parameterRepository.findManyByConditions({
      where: { group },
    })
  }

  async update(id: string, parameterDto: UpdateParameterDto) {
    await this.findOne(id)
    await this.parameterRepository.update(id, parameterDto)
    return { id }
  }

  async changeStatus(id: string) {
    const { status } = await this.findOne(id)
    const updatedParameter = this.parameterRepository.create({
      status: status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE,
    })

    await this.parameterRepository.update(id, updatedParameter)
    return {
      id,
      status: updatedParameter.status,
    }
  }
  async delete(id: string) {
    await this.findOne(id)
    await this.parameterRepository.delete(id)
    return { id }
  }
}
