import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import {
  ChangePaswwordDto,
  CreateUserDto,
  FilterUserDto,
  UpdateProfileDto,
  UpdateUserDto,
  STATUS,
  TextService,
} from '@app/common'
import { IUserRepository } from '../interface'
import { In } from 'typeorm'
import { IRoleRepository } from '../../roles/interface'
import { RpcException } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'
import { ExternalFileService } from '../../healtcheck/service/fileCheckService'

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly usersRepository: IUserRepository,
    @Inject('IRoleRepository')
    private readonly rolesRepository: IRoleRepository,
    private readonly externalFileService: ExternalFileService,
  ) {}

  async list(paginationQueryDto: FilterUserDto) {
    return await this.usersRepository.list(paginationQueryDto)
  }

  async create(
    createUserDto: CreateUserDto,
    image: Express.Multer.File | null | undefined,
  ) {
    const roles = await this.__validateUser({
      username: createUserDto.username,
      email: createUserDto.email,
      ci: createUserDto.ci,
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
    return await this.usersRepository.save(newUser)
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    image: Express.Multer.File,
  ) {
    const roles = await this.__validateUser(
      {
        username: updateUserDto.username,
        email: updateUserDto.email,
        ci: updateUserDto.ci,
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

  async delete(id: string) {
    await this.getUserProfile(id)
    return await this.usersRepository.delete(id)
  }

  async updateProfile(
    id: string,
    updateUserDto: UpdateProfileDto,
    image: Express.Multer.File | undefined | null,
  ) {
    if (id) await this.getUserProfile(id)

    const userExistsEmail = await this.findOneByEmail(updateUserDto.email)
    if (userExistsEmail && userExistsEmail.id !== id) {
      throw new RpcException('El email proporcionado ya esta registrado')
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
    if (image) {
      const imageRoute = await this.externalFileService.writteImage(
        image,
        updateUserDto.ci,
      )
      if (imageRoute) {
        updateUser.image = imageRoute
      }
    }
    return await this.usersRepository.update(id, updateUser)
  }

  async updatePassword(id: string, changePaswwordDto: ChangePaswwordDto) {
    const { newPassword, password } = changePaswwordDto
    const user = await this.usersRepository.findOneByCondition({
      where: { id },
      select: ['id', 'password'],
    })
    if (!user) {
      throw new RpcException('Usuario no encontrado')
    }
    const passwordIsValid = await TextService.compare(password, user.password)
    if (!passwordIsValid) {
      throw new RpcException('Las contraseñas no coinciden')
    }
    //    const hashedPassword = await TextService.validateLevelPassword(newPassword)
    const hashedPassword = await TextService.encrypt(newPassword)
    await this.usersRepository.update(id, { password: hashedPassword })
    return id
  }

  async changeStatus(idUser: string) {
    const user = await this.getUserProfile(idUser)
    const newStatus =
      user.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    await this.usersRepository.update(idUser, { status: newStatus })
    return {
      id: idUser,
      status: newStatus,
    }
  }

  async getUserProfile(id: string) {
    const user = await this.usersRepository.findOneByCondition({
      where: { id },
      relations: { roles: true },
      select: {
        id: true,
        roles: {
          id: true,
          name: true,
        },
        names: true,
        lastNames: true,
        email: true,
        ci: true,
        address: true,
        phone: true,
        username: true,
        status: true,
        image: true,
      },
    })
    if (!user) throw new RpcException('Usuario no encontrado')
    if (user.image) {
      const result = await this.externalFileService.getImage(user.image)
      user.image = result
    }
    return user
  }

  private async __validateUser(
    data: { username: string; email: string; ci: string; roles: string[] },
    id?: string,
  ) {
    const { username, email, ci, roles } = data
    if (id) await this.getUserProfile(id)
    const userExists = await this.findOneByUsername(username)
    if (userExists && (id === undefined || userExists.id !== id)) {
      throw new RpcException(
        new NotFoundException(
          'El nombre de usuario proporcionado ya esta registrado',
        ),
      )
    }

    const userExistsEmail = await this.findOneByEmail(email)
    if (userExistsEmail && (id === undefined || userExistsEmail.id !== id)) {
      throw new RpcException(
        new ConflictException('El email proporcionado ya esta registrado'),
      )
    }

    const ciAlreadyExists = await this.findOneByCi(ci)
    if (ciAlreadyExists && (id === undefined || ciAlreadyExists.id !== id)) {
      throw new RpcException(
        new NotFoundException('El ci proporcionado ya esta registrado'),
      )
    }

    if (data.roles.length === 0) {
      throw new RpcException(
        new BadRequestException('Debe seleccionar al menos un rol'),
      )
    }

    const foundRoles = await this.rolesRepository.findManyByConditions({
      where: [
        {
          id: In(roles),
        },
      ],
    })
    if (foundRoles.length < 1) {
      throw new RpcException(
        new NotFoundException('No se encontraron los roles seleccionados'),
      )
    }
    return foundRoles
  }

  async findOneByUsername(username: string) {
    return await this.usersRepository.findOneByCondition({
      where: { username },
      select: ['id', 'username'],
    })
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneByCondition({
      where: { email },
      select: ['id', 'email'],
    })
  }

  async findOneByCi(ci: string) {
    return await this.usersRepository.findOneByCondition({
      where: { ci },
      select: ['id', 'ci'],
    })
  }
}
