import {
  Injectable,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common'

import { User } from '../entities/user.entity'
import { UsersRepository } from '../repository'
import { CreateUserDto, UpdateUserDto } from '../dto'
import { Messages } from 'src/common/constants'
import { TextService } from 'src/common/lib/text.service'
@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private textService: TextService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { username } })
    if (!user) {
      throw new UnauthorizedException(Messages.INVALID_CREDENTIALS)
    }
    const passwordIsValid = await this.textService.compare(
      password,
      user.password
    )
    if (!passwordIsValid) {
      throw new UnauthorizedException(Messages.INVALID_CREDENTIALS)
    }
    return user
  }

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.findOneByUsername(createUserDto.username)
    if (userExists) {
      throw new UnauthorizedException(Messages.EXCEPTION_SAME_USERNAME)
    }
    const userExistsEmail = await this.findOneByEmail(createUserDto.email)
    if (userExistsEmail) {
      throw new UnauthorizedException(Messages.EXCEPTION_SAME_EMAIL)
    }
    createUserDto.password = await this.textService.encrypt(
      createUserDto.password
    )
    const newUser = this.usersRepository.create(createUserDto)
    return await this.usersRepository.save(newUser)
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAll()
  }

  async findOneById(id: string) {
    const user = await this.usersRepository.findOneById(id)
    if (!user) {
      throw new PreconditionFailedException(Messages.EXCEPTION_USER_NOT_FOUND)
    }
    return user
  }

  private async findOneByUsername(username: string) {
    return await this.usersRepository.findOne({ where: { username } })
  }

  private async findOneByEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email } })
  }

  private async validateUserInformation(
    data: { username: string; email: string },
    id?: string
  ) {
    if (id) {
      await this.findOneById(id)
    }
    const userExists = await this.findOneByUsername(data.username)
    if (userExists && (id === undefined || userExists.id !== id)) {
      throw new PreconditionFailedException(Messages.EXCEPTION_SAME_USERNAME)
    }

    const userExistsEmail = await this.findOneByEmail(data.email)
    if (userExistsEmail && (id === undefined || userExistsEmail.id !== id)) {
      throw new PreconditionFailedException(Messages.EXCEPTION_SAME_EMAIL)
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.validateUserInformation(
      { username: updateUserDto.username, email: updateUserDto.email },
      id
    )
    return await this.usersRepository.update(id, updateUserDto)
  }

  async delete(id: string) {
    return await this.usersRepository.delete(id)
  }
}
