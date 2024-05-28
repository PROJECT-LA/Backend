import { Brackets, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { Parameter } from '../entity'
import { BaseRepository, PaginationQueryDto } from '@app/common'
import { ParameterRepositoryInterface } from '../interface'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ParameterRepository
  extends BaseRepository<Parameter>
  implements ParameterRepositoryInterface
{
  constructor(
    @InjectRepository(Parameter)
    private readonly parameter: Repository<Parameter>
  ) {
    super(parameter)
  }

  async list(paginationQueryDto: PaginationQueryDto) {
    const { limit, skip, filter, order, sense } = paginationQueryDto
    const query = this.parameter
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
          qb.orWhere('parameter.name like :filter', {
            filter: `%${filter}%`,
          })
          qb.orWhere('parameter.description like :filter', {
            filter: `%${filter}%`,
          })
          qb.orWhere('parameter.group like :filter', {
            filter: `%${filter}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }

  /*   async findById(id: string) {
    return await this.dataSource
      .getRepository(Parameter)
      .createQueryBuilder('parameter')
      .where({ id })
      .getOne()
  }

  async update(id: string, parameterDto: UpdateParameterDto) {
    const data = new Parameter({
      ...parameterDto,
    })
    return await this.dataSource.getRepository(Parameter).update(id, data)
  }
*/

  /*

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
  async findByCode(code: string) {
    return this.dataSource.getRepository(Parameter).findOne({ where: { code } })
  }

  async save(parameterDto: CreateParameterDto) {
    return await this.dataSource.getRepository(Parameter).save(parameterDto)
  } */
}
