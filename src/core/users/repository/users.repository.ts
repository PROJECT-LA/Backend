import { DeepPartial, UpdateResult, DeleteResult, DataSource } from 'typeorm'
import { User } from '../entities'
import { Injectable } from '@nestjs/common'
@Injectable()
export class UsersRepository {
  constructor(private dataSource: DataSource) {}

  create(data: DeepPartial<User>): User {
    return this.dataSource.getRepository(User).create(data)
  }

  async preload(user: DeepPartial<User>): Promise<User> {
    return await this.dataSource.getRepository(User).preload(user)
  }

  async save(data: {
    username: string
    email: string
    password: string
    //roles: string[]
    status?: string
  }): Promise<User> {
    return this.dataSource.getRepository(User).save(data)
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
    return await this.dataSource.getRepository(User).update(id, data)
  }

  async delete(id: string): Promise<DeleteResult> {
    return await this.dataSource.getRepository(User).delete(id)
  }

  //Methods to Find Data
  async findByUserName(username: string): Promise<User> {
    return await this.dataSource
      .getRepository(User)
      .findOne({ where: { username } })
  }
  async findUserById(id: string): Promise<User> {
    return await this.dataSource.getRepository(User).findOne({ where: { id } })
  }
  async findUserByEmail(email: string): Promise<User> {
    return await this.dataSource
      .getRepository(User)
      .findOne({ where: { email } })
  }
}
