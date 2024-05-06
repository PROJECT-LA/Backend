import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateParameterDto, UpdateParameterDto } from '../dto'
import { PaginationQueryDto } from 'src/common'
import { Parameter } from '../entity'
import { MessagesParameter, ParameterStatus } from '../constant'
import { ParameterRepository } from '../repository'

@Injectable()
export class ParameterService {
  constructor(
    @Inject(ParameterRepository)
    private parametroRepositorio: ParameterRepository
  ) {}

  async create(parametroDto: CreateParameterDto) {
    const parametroRepetido = await this.parametroRepositorio.findByCode(
      parametroDto.code
    )

    if (parametroRepetido) {
      throw new ConflictException(MessagesParameter.ALREADY_EXISTS)
    }

    return await this.parametroRepositorio.create(parametroDto)
  }

  async findAll(paginationQueryDto: PaginationQueryDto) {
    return await this.parametroRepositorio.findAll(paginationQueryDto)
  }

  async findByGroup(grupo: string) {
    return await this.parametroRepositorio.findByGroup(grupo)
  }

  async update(id: string, parametroDto: UpdateParameterDto) {
    const parametro = await this.parametroRepositorio.findById(id)
    if (!parametro) {
      throw new NotFoundException(MessagesParameter.NOT_FOUND)
    }
    await this.parametroRepositorio.update(id, parametroDto)
    return { id }
  }

  async changeStatus(idParameter: string) {
    const parameter = await this.parametroRepositorio.findById(idParameter)
    if (!parameter) {
      throw new NotFoundException(MessagesParameter.NOT_FOUND)
    }
    const parametroDto = new Parameter()
    parametroDto.status =
      parameter.status === ParameterStatus.ACTIVE
        ? ParameterStatus.INACTIVE
        : ParameterStatus.ACTIVE
    await this.parametroRepositorio.update(idParameter, parametroDto)
    return {
      id: idParameter,
      status: parametroDto.status,
    }
  }
}
