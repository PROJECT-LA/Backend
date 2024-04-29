import {
  DeepPartial,
  UpdateResult,
  DeleteResult,
  DataSource,
  Brackets,
} from 'typeorm'
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { Role } from '../entities'
import { Injectable } from '@nestjs/common'
import { FilterRoleDto } from '../dto'

@Injectable()
export class RolesRepository {
  constructor(private dataSource: DataSource) {}

  public create(data: DeepPartial<Role>): Role {
    return this.dataSource.getRepository(Role).create(data)
  }

  public preload(role: DeepPartial<Role>): Promise<Role> {
    return this.dataSource.getRepository(Role).preload(role)
  }

  public async save(data: DeepPartial<Role>): Promise<Role> {
    return this.dataSource.getRepository(Role).save(data)
  }

  public async update(
    id: string,
    data: QueryPartialEntity<Role>
  ): Promise<UpdateResult> {
    return await this.dataSource.getRepository(Role).update(id, data)
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.dataSource.getRepository(Role).delete(id)
  }

  public findOneById(id: string): Promise<Role> {
    return this.dataSource.getRepository(Role).findOne({ where: { id } })
  }

  public findOneByRoleName(name: string): Promise<Role> {
    return this.dataSource.getRepository(Role).findOne({ where: { name } })
  }

  async findAll(filterDto: FilterRoleDto) {
    const { limit, order, sense, skip, filter } = filterDto
    const query = this.dataSource
      .getRepository(Role)
      .createQueryBuilder('role')
      .select(['role.id', 'role.name', 'role.description', 'role.status'])
      .take(limit)
      .skip(skip)

    switch (order) {
      case 'names':
        query.addOrderBy('role.name', sense)
        break
      case 'description':
        query.addOrderBy('role.description', sense)
        break
      case 'status':
        query.addOrderBy('role.status', sense)
        break
      default:
        query.orderBy('role.id', 'ASC')
    }

    if (filter) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('role.name like :filter', { filter: `%${filter}%` })
          qb.orWhere('role.description like :filter', {
            filter: `%${filter}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  }
}
