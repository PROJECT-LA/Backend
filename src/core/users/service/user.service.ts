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
import { RolesRepository } from 'src/core/roles/repository'
import { MESSAGES } from '@nestjs/core/constants'
@Injectable()
export class UserService {
  constructor(
    @Inject(UsersRepository)
    private readonly usersRepository: UsersRepository,
    @Inject(RolesRepository)
    private readonly rolesRepository: RolesRepository,
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
    const roles = await this.validateUpdateCreateUser({
      username: createUserDto.username,
      email: createUserDto.email,
      roles: createUserDto.roles,
    })

    const newUser = this.usersRepository.create({
      email: createUserDto.email,
      lastNames: createUserDto.lastNames,
      password: await this.textService.encrypt(createUserDto.password),
      phone: createUserDto.phone,
      names: createUserDto.names,
      username: createUserDto.username,
      roles: roles,
    })
    return await this.usersRepository.save(newUser)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const roles = await this.validateUpdateCreateUser(
      {
        username: updateUserDto.username,
        email: updateUserDto.email,
        roles: updateUserDto.roles,
      },
      id
    )
    const updateUser = this.usersRepository.create({
      id: id,
      email: updateUserDto.email,
      lastNames: updateUserDto.lastNames,
      phone: updateUserDto.phone,
      names: updateUserDto.names,
      username: updateUserDto.username,
      roles: roles,
    })
    //Todo: Evaluar despues
    //return await this.usersRepository.update(id, updateUserDto)
    return await this.usersRepository.update(updateUser)
  }

  async delete(id: string) {
    await this.findOneById(id)
    return await this.usersRepository.delete(id)
  }

  private async validateUpdateCreateUser(
    data: { username: string; email: string; roles: string[] },
    id?: string
  ) {
    const { username, email, roles } = data
    if (id) {
      await this.findOneById(id)
    }
    const userExists = await this.findOneByUsername(username)
    if (userExists && (id === undefined || userExists.id !== id)) {
      throw new PreconditionFailedException(Messages.EXCEPTION_SAME_USERNAME)
    }

    const userExistsEmail = await this.findOneByEmail(email)
    if (userExistsEmail && (id === undefined || userExistsEmail.id !== id)) {
      throw new PreconditionFailedException(Messages.EXCEPTION_SAME_EMAIL)
    }
    if (data.roles.length === 0) {
      throw new PreconditionFailedException(Messages.EXCEPTION_ROLE_NOT_SEND)
    }
    const foundRoles = await Promise.all(
      roles.map(async (role) => {
        const roleExists = await this.rolesRepository.findOneById(role)
        if (!roleExists) {
          throw new PreconditionFailedException(
            Messages.EXCEPTION_ROLE_NOT_FOUND
          )
        }
        return roleExists
      })
    )
    return foundRoles
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
