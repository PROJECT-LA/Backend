import {
  Inject,
  Injectable,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common'

import { UsersRepository } from '../repository'
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dto'
import { Messages } from 'src/common/constants'
import { TextService } from 'src/common/lib/text.service'
@Injectable()
export class UserService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    private textService: TextService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersRepository.findByUserName(username)
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

  async findOneById(id: string) {
    const user = await this.usersRepository.findUserById(id)
    if (!user) {
      throw new PreconditionFailedException(Messages.EXCEPTION_USER_NOT_FOUND)
    }
    return user
  }

  async create(createUserDto: CreateUserDto) {
    await this.validateUpdateCreateUser({
      username: createUserDto.username,
      email: createUserDto.email,
    })
    createUserDto.password = await this.textService.encrypt(
      createUserDto.password
    )
    const newUser = this.usersRepository.create(createUserDto)
    return await this.usersRepository.save(newUser)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.validateUpdateCreateUser(
      { username: updateUserDto.username, email: updateUserDto.email },
      id
    )
    return await this.usersRepository.update(id, updateUserDto)
  }

  async delete(id: string) {
    await this.findOneById(id)
    return await this.usersRepository.delete(id)
  }

  private async validateUpdateCreateUser(
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

  private async findOneByUsername(username: string) {
    return await this.usersRepository.findByUserName(username)
  }

  private async findOneByEmail(email: string) {
    return await this.usersRepository.findUserByEmail(email)
  }

  async findAll(paginacionQueryDto: FilterUserDto) {
    return await this.usersRepository.findAll(paginacionQueryDto)
  }
}
