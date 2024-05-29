import { Inject, Injectable, PreconditionFailedException } from '@nestjs/common'

import {
  ChangePaswwordDto,
  CreateUserDto,
  FilterUserDto,
  UpdateProfileDto,
  UpdateUserDto,
} from '../dto'
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

  async create(
    createUserDto: CreateUserDto,
    image: Express.Multer.File | null | undefined,
  ) {
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
      ci: createUserDto.ci,
      address: createUserDto.address,
      names: createUserDto.names,
      username: createUserDto.username,
      roles: roles,
    })

    if (image) {
    }
    //this.fileService.writteFile(newUser, 'ds', image)
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
      ci: updateUserDto.ci,
      address: updateUserDto.address,
      roles: roles,
    })
    return await this.usersRepository.save(updateUser)
  }

  async updateProfile(id: string, updateUserDto: UpdateProfileDto) {
    if (id) await this.getCurrentUser(id)

    const userExistsEmail = await this.__findOneByEmail(updateUserDto.email)
    if (userExistsEmail && userExistsEmail.id !== id) {
      throw new PreconditionFailedException(Messages.EXCEPTION_SAME_EMAIL)
    }

    const updateUser = this.usersRepository.create({
      id: id,
      email: updateUserDto.email,
      lastNames: updateUserDto.lastNames,
      phone: updateUserDto.phone,
      names: updateUserDto.names,
      ci: updateUserDto.ci,
      address: updateUserDto.address,
    })
    return await this.usersRepository.update(id, updateUser)
  }

  async delete(id: string) {
    await this.getCurrentUser(id)
    return await this.usersRepository.delete(id)
  }

  async updatePassword(id: string, changePaswwordDto: ChangePaswwordDto) {
    const { newPassword, password } = changePaswwordDto
    const user = await this.usersRepository.findOneByCondition({
      where: { id },
      select: ['id', 'password'],
    })
    if (!user) {
      throw new PreconditionFailedException(Messages.EXCEPTION_USER_NOT_FOUND)
    }
    const passwordIsValid = await TextService.compare(password, user.password)
    if (!passwordIsValid) {
      throw new PreconditionFailedException(
        Messages.EXCEPTION_PASSWORD_NOT_VALID,
      )
    }
    //    const hashedPassword = await TextService.validateLevelPassword(newPassword)
    const hashedPassword = await TextService.encrypt(newPassword)
    await this.usersRepository.update(id, { password: hashedPassword })
    return id
  }

  async changeStatus(idUser: string) {
    const user = await this.getCurrentUser(idUser)
    const newStatus =
      user.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    await this.usersRepository.update(idUser, { status: newStatus })
    return {
      id: idUser,
      status: newStatus,
    }
  }

  async getCurrentUser(id: string) {
    const user = await this.usersRepository.findOneByCondition({
      where: { id },
      relations: { roles: true },
      select: {
        id: true,
        roles: {
          id: true,
          name: true,
          status: true,
        },
        names: true,
        lastNames: true,
        email: true,
        ci: true,
        address: true,
        phone: true,
        username: true,
        status: true,
      },
    })
    if (!user) {
      throw new PreconditionFailedException(Messages.EXCEPTION_USER_NOT_FOUND)
    }
    return user
  }
  //Metodos de validacion de Usuarios
  private async __validateUser(
    data: { username: string; email: string; roles: string[] },
    id?: string,
  ) {
    const { username, email, roles } = data
    if (id) await this.getCurrentUser(id)
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
}
