import { Inject, Injectable, PreconditionFailedException } from '@nestjs/common'

import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dto'
import { Messages, STATUS, TextService } from '@app/common'
import { UserRepositoryInterface } from '../interface'
import { In } from 'typeorm'
import { RoleRepositoryInterface } from '../../roles/interface'

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly usersRepository: UserRepositoryInterface,
    @Inject('IRoleRepository')
    private readonly rolesRepository: RoleRepositoryInterface,
  ) {}
  async list(paginacionQueryDto: FilterUserDto) {
    return await this.usersRepository.list(paginacionQueryDto)
  }

  async create(createUserDto: CreateUserDto) {
    const roles = await this.__validateUser({
      username: createUserDto.username,
      email: createUserDto.email,
      roles: createUserDto.roles,
    })

    const newUser = this.usersRepository.create({
      email: createUserDto.email,
      lastNames: createUserDto.lastNames,
      password: await TextService.encrypt(createUserDto.password),
      phone: createUserDto.phone,
      names: createUserDto.names,
      username: createUserDto.username,
      roles: roles,
    })
    return await this.usersRepository.save(newUser)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const roles = await this.__validateUser(
      {
        username: updateUserDto.username,
        email: updateUserDto.email,
        roles: updateUserDto.roles,
      },
      id,
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
    return await this.usersRepository.save(updateUser)
  }

  async delete(id: string) {
    await this.__findOneById(id)
    return await this.usersRepository.delete(id)
  }

  //Metodos de validacion de Usuarios
  private async __validateUser(
    data: { username: string; email: string; roles: string[] },
    id?: string,
  ) {
    const { username, email, roles } = data
    if (id) await this.__findOneById(id)
    const userExists = await this.__findOneByUsername(username)
    if (userExists && (id === undefined || userExists.id !== id)) {
      throw new PreconditionFailedException(Messages.EXCEPTION_SAME_USERNAME)
    }

    const userExistsEmail = await this.__findOneByEmail(email)
    if (userExistsEmail && (id === undefined || userExistsEmail.id !== id)) {
      throw new PreconditionFailedException(Messages.EXCEPTION_SAME_EMAIL)
    }
    if (data.roles.length === 0) {
      throw new PreconditionFailedException(Messages.EXCEPTION_ROLE_NOT_SEND)
    }

    const foundRoles = await this.rolesRepository.findManyByConditions({
      where: [
        {
          id: In(roles),
        },
      ],
    })
    if (foundRoles.length < 1) {
      throw new PreconditionFailedException(Messages.EXCEPTION_ROLE_NOT_FOUND)
    }
    //mejorara la validacion de roles
    return foundRoles
  }

  private async __findOneByUsername(username: string) {
    return await this.usersRepository.findOneByCondition({
      where: { username },
      select: ['id', 'username'],
    })
  }

  private async __findOneByEmail(email: string) {
    return await this.usersRepository.findOneByCondition({
      where: { email },
      select: ['id', 'email'],
    })
  }

  async __findOneById(id: string) {
    const user = await this.usersRepository.findOneByCondition({
      where: { id },
      select: [
        'id',
        'names',
        'lastNames',
        'email',
        'phone',
        'username',
        'status',
      ],
      relations: ['roles'],
    })
    if (!user) {
      throw new PreconditionFailedException(Messages.EXCEPTION_USER_NOT_FOUND)
    }
    return user
  }

  async updatePassword(id: string, password: string) {
    await this.__findOneById(id)
    const hashedPassword = await TextService.encrypt(password)
    await this.usersRepository.update(id, { password: hashedPassword })
    return id
  }

  async changeStatus(idUser: string) {
    const user = await this.__findOneById(idUser)
    const newStatus =
      user.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    await this.usersRepository.update(idUser, { status: newStatus })
    return {
      id: idUser,
      status: newStatus,
    }
  }
}
