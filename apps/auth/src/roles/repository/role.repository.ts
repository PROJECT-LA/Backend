import { Brackets, Repository } from 'typeorm'
import { Role } from '../entities'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IRoleRepository } from '../interface'
import { FilterRoleDto } from '../dto'

@Injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  constructor(
    @InjectRepository(Role)
    private readonly role: Repository<Role>,
  ) {
    super(role)
  }

  async list(filterDto: FilterRoleDto) {
    const { limit, order, sense, skip, filter } = filterDto
    const query = this.role
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
        }),
      )
    }
    return await query.getManyAndCount()
  }
}
