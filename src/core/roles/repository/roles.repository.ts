import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DeepPartial, UpdateResult, DeleteResult } from 'typeorm'
import { BaseAbstractRepostitory } from 'src/common/abstract/base.repository'
import { QueryPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { Role } from '../entities'

export class RolesRepository extends BaseAbstractRepostitory<Role> {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {
    super(roleRepository)
  }

  public create(data: DeepPartial<Role>): Role {
    return super.create(data)
  }

  public preload(role: DeepPartial<Role>): Promise<Role> {
    return super.preload(role)
  }

  public async save(data: DeepPartial<Role>): Promise<Role> {
    return super.save(data)
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

  public findOneById(id: string): Promise<Role> {
    return super.findOne({ where: { id } })
  }

  public findOneByRoleName(name: string): Promise<Role> {
    return super.findOne({ where: { name } })
  }
}
