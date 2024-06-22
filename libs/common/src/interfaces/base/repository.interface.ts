import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  UpdateResult,
  DeleteResult,
  EntityManager,
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T
  createMany(data: DeepPartial<T>[]): T[]
  save(data: DeepPartial<T>): Promise<T>
  saveMany(data: DeepPartial<T>[]): Promise<T[]>
  findOneById(id: string): Promise<T>
  findOneByCondition(filterCondition: FindOneOptions<T>): Promise<T>
  findAll(options?: FindManyOptions<T>): Promise<T[]>
  getPaginateItems(options: FindManyOptions): Promise<[T[], number]>
  remove(data: T): Promise<T>
  findManyByConditions(relations: FindManyOptions<T>): Promise<T[]>
  preload(entityLike: DeepPartial<T>): Promise<T>
  update(
    id: string,
    entityLike: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>
  delete(id: string): Promise<DeleteResult>
  transactional<R>(
    operation: (manager: EntityManager) => Promise<R>,
  ): Promise<R>
}
