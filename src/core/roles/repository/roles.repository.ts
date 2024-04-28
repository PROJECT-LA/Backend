import { DeepPartial, UpdateResult, DeleteResult, DataSource } from 'typeorm'
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { Role } from '../entities'
import { Injectable } from '@nestjs/common'
@Injectable()
export class RolesRepository {
  constructor(private dataSource: DataSource) {}

  public create(data: DeepPartial<Role>): Role {
    return this.dataSource.getRepository(Role).create(data)
  }

  public preload(role: DeepPartial<Role>): Promise<Role> {
    return this.dataSource.getRepository(Role).preload(role)
  }

  public async save(data: DeepPartial<Role>): Promise<Role> {
    return this.dataSource.getRepository(Role).save(data)
  }

  public async update(
    id: string,
    data: QueryPartialEntity<Role>
  ): Promise<UpdateResult> {
    return await this.dataSource.getRepository(Role).update(id, data)
  }

  public async delete(id: string): Promise<DeleteResult> {
    return await this.dataSource.getRepository(Role).delete(id)
  }

  public findOneById(id: string): Promise<Role> {
    return this.dataSource.getRepository(Role).findOne({ where: { id } })
  }

  public findOneByRoleName(name: string): Promise<Role> {
    return this.dataSource.getRepository(Role).findOne({ where: { name } })
  }
}
