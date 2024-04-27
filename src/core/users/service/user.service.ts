import { Injectable, UnauthorizedException } from '@nestjs/common'

import { User } from '../entities/user.entity'
import { UsersRepository } from '../repository'
import * as bcrypt from 'bcrypt'
import { CreateUserDto, UpdateUserDto } from '../dto'
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

  async findOneById(id: string) {
    return await this.usersRepository.findOneById(id)
  }

  async findOneByUsername(username: string) {
    return await this.usersRepository.findOne({ where: { username } })
  }

  async update(id: string, updateUserInput: UpdateUserDto) {
    return await this.usersRepository.update(id, updateUserInput)
  }

  remove(id: string) {
    return `This action removes a #${id} user`
  }
}
