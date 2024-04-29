import {
  DeepPartial,
  UpdateResult,
  DeleteResult,
  DataSource,
  Brackets,
} from 'typeorm'
import { User } from '../entities'
import { Injectable } from '@nestjs/common'
import { FilterUserDto } from '../dto'
@Injectable()
export class UsersRepository {
  constructor(private dataSource: DataSource) {}

  create(data: DeepPartial<User>): User {
    return this.dataSource.getRepository(User).create(data)
  }

  async preload(user: DeepPartial<User>): Promise<User> {
    return await this.dataSource.getRepository(User).preload(user)
  }

  async save(data: {
    username: string
    email: string
    password: string
    //roles: string[]
    status?: string
  }): Promise<User> {
    return this.dataSource.getRepository(User).save(data)
  }

  async update(
    id: string,
    data: {
      username?: string
      email?: string
      lastNames?: string
      names?: string
      phone?: string
      //roles?: string[]
    }
  ): Promise<UpdateResult> {
    return await this.dataSource.getRepository(User).update(id, data)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.dataSource.getRepository(User).delete(id)
  }

  //Methods to Find Data
  async findByUserName(username: string): Promise<User> {
    return await this.dataSource
      .getRepository(User)
      .findOne({ where: { username } })
  }
  async findUserById(id: string): Promise<User> {
    return await this.dataSource.getRepository(User).findOne({ where: { id } })
  }
  async findUserByEmail(email: string): Promise<User> {
    return await this.dataSource
      .getRepository(User)
      .findOne({ where: { email } })
  }

  async findAll(filterDto: FilterUserDto) {
    const { limit, order, sense, skip, filter } = filterDto
    const query = this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.names',
        'user.lastNames',
        'user.email',
        'user.phone',
        'user.status',
      ])
      .take(limit)
      .skip(skip)

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
        })
      )
    }
    return await query.getManyAndCount()
  }
}
