import { Injectable } from '@nestjs/common'

import { DataSource } from 'typeorm'
import { User } from '../entities/user.entity'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'

@Injectable()
export class UserService {
  constructor(private dataSource: DataSource) {}
  async create(createUserInput: CreateUserDto) {
    const newUser = this.dataSource.getRepository(User).create(createUserInput)
    return await this.dataSource.getRepository(User).save(newUser)
  }

  async findAll(): Promise<User[]> {
    return await this.dataSource.getRepository(User).find()
  }

  async findOne(id: number) {
    return await this.dataSource.getRepository(User).findOne({ where: { id } })
  }

  async findOneByUsername(username: string) {
    return await this.dataSource
      .getRepository(User)
      .findOne({ where: { username: username } })
  }

  async update(id: number, updateUserInput: UpdateUserDto) {
    await this.dataSource.getRepository(User).update(id, updateUserInput)
    return await this.dataSource.getRepository(User).findOne({ where: { id } })
  }
  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
