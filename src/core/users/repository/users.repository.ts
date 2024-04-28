import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DeepPartial, UpdateResult, DeleteResult } from 'typeorm'
import { BaseAbstractRepostitory } from 'src/common/abstract/base.repository'
import { User } from '../entities'

export class UsersRepository extends BaseAbstractRepostitory<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {
    super(userRepository)
  }

  create(data: DeepPartial<User>): User {
    return super.create(data)
  }

  async preload(user: DeepPartial<User>): Promise<User> {
    return await super.preload(user)
  }

  async save(data: {
    username: string
    email: string
    password: string
    //roles: string[]
    status?: string
  }): Promise<User> {
    return super.save(data)
  }

  async update(
    id: string,
    data: {
      username?: string
      email?: string
      lastNames?: string
      names?: string
      phone?: string
      //roles?: string[]
    }
  ): Promise<UpdateResult> {
    return await super.update(id, data)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await super.delete(id)
  }

  //Methods to Find Data
  async findByUserName(username: string): Promise<User> {
    return await super.findOne({ where: { username } })
  }
  async findUserById(id: string): Promise<User> {
    return await super.findOne({ where: { id } })
  }
  async findUserByEmail(email: string): Promise<User> {
    return await super.findOne({ where: { email } })
  }
}
