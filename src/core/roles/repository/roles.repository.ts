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
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { Role } from '../entities'

export class RolesRepository extends BaseAbstractRepostitory<Role> {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {
    super(roleRepository)
  }

  async findAll(
    options?: FindManyOptions<Role>,
    paginationOptions?: PaginationOptions
  ): Promise<Role[]> {
    return await super.findAll(options, paginationOptions)
  }

  public findOneById(id: any): Promise<Role> {
    return super.findOneById(id)
  }

  public create(data: DeepPartial<Role>): Role {
    return super.create(data)
  }

  public createMany(data: DeepPartial<Role>[]): Role[] {
    return super.createMany(data)
  }

  public findOne(options: FindOneOptions<Role>): Promise<Role> {
    return super.findOne(options)
  }

  public async findByCondition(
    filterCondition: FindOneOptions<Role>
  ): Promise<Role> {
    return await super.findByCondition(filterCondition)
  }

  public async findWithRelations(
    relations: FindManyOptions<Role>
  ): Promise<Role[]> {
    return await super.findWithRelations(relations)
  }
  public preload(entityLike: DeepPartial<Role>): Promise<Role> {
    return super.preload(entityLike)
  }
  public async remove(data: Role): Promise<Role> {
    return super.remove(data)
  }
  public async save(data: DeepPartial<Role>): Promise<Role> {
    return super.save(data)
  }
  public saveMany(data: DeepPartial<Role>[]): Promise<Role[]> {
    return super.saveMany(data)
  }
  public async update(
    id: string,
    data: QueryPartialEntity<Role>
  ): Promise<UpdateResult> {
    return await super.update(id, data)
  }
  public async delete(id: string): Promise<DeleteResult> {
    return await super.delete(id)
  }
}
