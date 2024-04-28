import {
  DeepPartial,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
} from 'typeorm'
import { PaginationOptions } from './filter.interface'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T
  createMany(data: DeepPartial<T>[]): T[]
  save(data: DeepPartial<T>): Promise<T>
  saveMany(data: DeepPartial<T>[]): Promise<T[]>
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T[]>
  findAll(options?: FindManyOptions<T>): Promise<T[]>
  remove(data: T): Promise<T>
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>
  preload(entityLike: DeepPartial<T>): Promise<T>
  findOne(options: FindOneOptions<T>): Promise<T>
  update(id: string, data: QueryDeepPartialEntity<T>): Promise<UpdateResult>
  delete(id: string): Promise<DeleteResult>
}
