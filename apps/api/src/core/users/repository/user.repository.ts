import { Brackets, Repository } from 'typeorm'
import { User } from '../entities'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IUserRepository } from '../interface'
import { FilterUserDto } from '../dto'
import { BaseRepository, STATUS } from '@app/common'
@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {
    super(user)
  }

  async validateCredentials(username: string): Promise<User> {
    return this.user
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role', 'role.status = :roleStatus', {
        roleStatus: STATUS.ACTIVE,
      })
      .where('user.username = :username AND user.status = :userStatus', {
        username,
        userStatus: STATUS.ACTIVE,
      })
      .select(['user.id', 'user.password', 'role.id', 'role.name'])
      .getOne()
  }

  async list(filterDto: FilterUserDto): Promise<[User[], number]> {
    const { limit, order, sense, skip, filter } = filterDto
    const query = this.user
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .select([
        'user.id',
        'user.names',
        'user.lastNames',
        'user.email',
        'user.phone',
        'user.ci',
        'user.address',
        'user.status',
        'roles.id',
        'roles.name',
      ])

    switch (order) {
      case 'names':
        query.addOrderBy('user.names', sense)
        break
      case 'lastNames':
        query.addOrderBy('user.lastNames', sense)
        break
      case 'email':
        query.addOrderBy('user.email', sense)
        break
      case 'phone':
        query.addOrderBy('user.phone', sense)
        break
      case 'status':
        query.addOrderBy('user.status', sense)
        break

      default:
        query.orderBy('user.id', 'ASC')
    }

    if (filter) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('user.names like :filter', { filter: `%${filter}%` })
          qb.orWhere('user.lastNames like :filter', {
            filter: `%${filter}%`,
          })
          qb.orWhere('user.ci like :filter', {
            filter: `%${filter}%`,
          })
        }),
      )
    }
    query.take(limit).skip(skip)

    return await query.getManyAndCount()
  }
}
