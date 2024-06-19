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
import { InternalServerErrorException } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

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
    try {
      return await this.entity.save(data)
    } catch (error) {
      throw new RpcException(new InternalServerErrorException(error))
    }
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    try {
      return await this.entity.save(data)
    } catch (error) {
      throw new RpcException(new InternalServerErrorException(error))
    }
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
    try {
      return await this.entity.find(relations)
    } catch (error) {
      throw new RpcException(new InternalServerErrorException(error))
    }
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    try {
      return await this.entity.find(options)
    } catch (error) {
      throw new RpcException(new InternalServerErrorException(error))
    }
  }

  public async getPaginateItems(
    options: FindManyOptions<T>,
  ): Promise<[T[], number]> {
    try {
      return await this.entity.findAndCount(options)
    } catch (error) {
      throw new RpcException(new InternalServerErrorException(error))
    }
  }

  public async remove(data: T): Promise<T> {
    try {
      return await this.entity.remove(data)
    } catch (error) {
      throw new RpcException(new InternalServerErrorException(error))
    }
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike)
  }

  public async delete(id: string): Promise<DeleteResult> {
    try {
      return await this.entity.delete(id)
    } catch (error) {
      throw new RpcException(new InternalServerErrorException(error))
    }
  }

  public async update(
    id: string,
    entityLike: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    try {
      return await this.entity.update(id, entityLike)
    } catch (error) {
      throw new RpcException(new InternalServerErrorException(error))
    }
  }
}
