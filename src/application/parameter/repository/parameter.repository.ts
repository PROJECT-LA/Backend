import { Brackets, DataSource } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { ParameterStatus } from '../constant'
import { Parameter } from '../entity'
import { CreateParameterDto, UpdateParameterDto } from '../dto'
import { PaginationQueryDto } from 'src/common'

@Injectable()
export class ParameterRepository {
  constructor(private dataSource: DataSource) {}

  async findById(id: string) {
    return await this.dataSource
      .getRepository(Parameter)
      .createQueryBuilder('parameter')
      .where({ id: id })
      .getOne()
  }

  async update(id: string, parametroDto: UpdateParameterDto) {
    const datosActualizar = new Parameter({
      ...parametroDto,
    })
    return await this.dataSource
      .getRepository(Parameter)
      .update(id, datosActualizar)
  }

  async findAll(paginacionQueryDto: PaginationQueryDto) {
    const { limit, skip, filter, order, sense } = paginacionQueryDto
    const query = this.dataSource
      .getRepository(Parameter)
      .createQueryBuilder('parameter')
      .select([
        'parameter.id',
        'parameter.code',
        'parameter.name',
        'parameter.group',
        'parameter.description',
        'parameter.status',
      ])
      .take(limit)
      .skip(skip)

    switch (order) {
      case 'code':
        query.addOrderBy('parameter.code', sense)
        break
      case 'name':
        query.addOrderBy('parameter.name', sense)
        break
      case 'description':
        query.addOrderBy('parameter.description', sense)
        break
      case 'group':
        query.addOrderBy('parameter.group', sense)
        break
      case 'status':
        query.addOrderBy('parameter.status', sense)
        break
      default:
        query.orderBy('parameter.id', 'ASC')
    }

    if (filter) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('parameter.code like :filter', { filter: `%${filter}%` })
          qb.orWhere('parameter.name ilike :filter', {
            filter: `%${filter}%`,
          })
          qb.orWhere('parameter.description ilike :filter', {
            filter: `%${filter}%`,
          })
          qb.orWhere('parameter.group ilike :filter', {
            filter: `%${filter}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }

  async findByGroup(group: string) {
    return await this.dataSource
      .getRepository(Parameter)
      .createQueryBuilder('parameter')
      .select(['parameter.id', 'parameter.code', 'parameter.name'])
      .where('parameter.group = :group', {
        group,
      })
      .andWhere('parameter.status = :status', {
        status: ParameterStatus.ACTIVE,
      })
      .getMany()
  }

  findByCode(code: string) {
    return this.dataSource
      .getRepository(Parameter)
      .findOne({ where: { code: code } })
  }

  async create(parametroDto: CreateParameterDto) {
    const { code, name, group, description } = parametroDto

    const parameter = new Parameter()
    parameter.code = code
    parameter.name = name
    parameter.group = group
    parameter.description = description

    return await this.dataSource.getRepository(Parameter).save(parameter)
  }
}
