import { Injectable, UnauthorizedException } from '@nestjs/common'

import { User } from '../entities/user.entity'
import { UsersRepository } from '../repository'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '../dto'
@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { username } })
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid.')
    }
    const passwordIsValid = await bcrypt.compare(password, user.password)
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.')
    }
    return user
  }

  async create(createUserInput: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserInput)
    return await this.usersRepository.save(newUser)
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll()
  }

  async findOne(id: number) {
    return await this.usersRepository.findOneById(id)
  }

  async findOneByUsername(username: string) {
    return await this.usersRepository.findOne({ where: { username } })
  }

  /*   async update(id: number, updateUserInput: UpdateUserDto) {
    await this.dataSource.getRepository(User).update(id, updateUserInput)
    return await this.dataSource.getRepository(User).findOne({ where: { id } })
  }
  remove(id: number) {
    return `This action removes a #${id} user`
  }
 */
}
