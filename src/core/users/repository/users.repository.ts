import { InjectRepository } from '@nestjs/typeorm'
import {
  Repository,
  FindManyOptions,
  DeepPartial,
  FindOneOptions,
} from 'typeorm'
import { BaseAbstractRepostitory } from 'src/common/abstract/base.repository'
import { PaginationOptions } from 'src/common/interfaces'
import { UsersRepositoryInterface } from '../interface'
import { User } from '../entities'

export class UsersRepository
  extends BaseAbstractRepostitory<User>
  implements UsersRepositoryInterface
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {
    super(userRepository)
  }

  async findAll(
    options?: FindManyOptions<User>,
    paginationOptions?: PaginationOptions
  ): Promise<User[]> {
    return await super.findAll(options, paginationOptions)
  }

  public findOneById(id: any): Promise<User> {
    return super.findOneById(id)
  }

  public create(data: DeepPartial<User>): User {
    return super.create(data)
  }

  public createMany(data: DeepPartial<User>[]): User[] {
    return super.createMany(data)
  }

  public findOne(options: FindOneOptions<User>): Promise<User> {
    return super.findOne(options)
  }

  public async findByCondition(
    filterCondition: FindOneOptions<User>
  ): Promise<User> {
    return await super.findByCondition(filterCondition)
  }

  public async findWithRelations(
    relations: FindManyOptions<User>
  ): Promise<User[]> {
    return await super.findWithRelations(relations)
  }
  public preload(entityLike: DeepPartial<User>): Promise<User> {
    return super.preload(entityLike)
  }
  public async remove(data: User): Promise<User> {
    return super.remove(data)
  }
  public async save(data: DeepPartial<User>): Promise<User> {
    return super.save(data)
  }
  public saveMany(data: DeepPartial<User>[]): Promise<User[]> {
    return super.saveMany(data)
  }
  public update(id: string, data: DeepPartial<User>): Promise<User> {
    return super.update(id, data)
  }
}
