import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { BaseInterfaceRepository } from '../interfaces/repository.interface'

interface HasId {
  id: string
}

export abstract class BaseRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>
  protected constructor(entity: Repository<T>) {
    this.entity = entity
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data)
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data)
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data)
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data)
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    }
    return await this.entity.findOneBy(options)
  }

  public async findOneByCondition(
    filterCondition: FindOneOptions<T>,
  ): Promise<T> {
    return await this.entity.findOne(filterCondition)
  }

  public async findManyByConditions(
    relations: FindManyOptions<T>,
  ): Promise<T[]> {
    return await this.entity.find(relations)
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options)
  }

  public async remove(data: T): Promise<T> {
    return await this.entity.remove(data)
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike)
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.entity.delete(id)
  }

  public async update(
    id: string,
    entityLike: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return await this.entity.update(id, entityLike)
  }
}
