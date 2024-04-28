import { InjectRepository } from '@nestjs/typeorm'
import {
  Repository,
  FindManyOptions,
  DeepPartial,
  FindOneOptions,
  UpdateResult,
  DeleteResult,
} from 'typeorm'
import { BaseAbstractRepostitory } from 'src/common/abstract/base.repository'
import { PaginationOptions } from 'src/common/interfaces'
import { User } from '../entities'
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export class UsersRepository extends BaseAbstractRepostitory<User> {
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

  public create(data: DeepPartial<User>): User {
    return super.create(data)
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

  public findOne(options: FindOneOptions<User>): Promise<User> {
    return super.findOne(options)
  }

  public findOneById(id: any): Promise<User> {
    return super.findOneById(id)
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

  //Methods without return value
  public async update(
    id: string,
    data: QueryPartialEntity<User>
  ): Promise<UpdateResult> {
    return await super.update(id, data)
  }
  public async delete(id: string): Promise<DeleteResult> {
    return await super.delete(id)
  }

  //Methods for bulk operations
  public saveMany(data: DeepPartial<User>[]): Promise<User[]> {
    return super.saveMany(data)
  }
  public createMany(data: DeepPartial<User>[]): User[] {
    return super.createMany(data)
  }
}
