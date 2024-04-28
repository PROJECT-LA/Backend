import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export abstract class BaseAbstractRepostitory<T> {
  private entity: Repository<T>
  protected constructor(entity: Repository<T>) {
    this.entity = entity
  }
  //Metodos de busqueda
  protected async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    const queryOptions: FindManyOptions<T> = {
      ...options,
    }
    return await this.entity.find(queryOptions)
  }

  protected async findOne(options: FindOneOptions<T>): Promise<T> {
    return this.entity.findOne(options)
  }

  protected async findByCondition(
    filterCondition: FindOneOptions<T>
  ): Promise<T[]> {
    return await this.entity.find(filterCondition)
  }

  protected async findWithRelations(
    relations: FindManyOptions<T>
  ): Promise<T[]> {
    return await this.entity.find(relations)
  }

  //Metodos que dependen de objetos
  protected async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data)
  }

  create(data: DeepPartial<T>): T {
    return this.entity.create(data)
  }

  protected async remove(data: T): Promise<T> {
    return await this.entity.remove(data)
  }

  protected async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike)
  }

  //Metodos que devuelven Resultados
  protected async update(
    id: string,
    partialEntity: QueryDeepPartialEntity<T>
  ): Promise<UpdateResult> {
    return await this.entity.update(id, partialEntity)
  }

  protected async delete(id: string): Promise<DeleteResult> {
    return await this.entity.delete(id)
  }

  //Metodos para creacion multiple
  createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data)
  }

  protected async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return await this.entity.save(data)
  }
}
