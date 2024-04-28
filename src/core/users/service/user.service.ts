import {
  Injectable,
  PreconditionFailedException,
  UnauthorizedException,
} from '@nestjs/common'

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

  /*   async listar(paginacionQueryDto: FiltrosUsuarioDto) {
    const { limite, saltar, filtro, rol, orden, sentido } = paginacionQueryDto

    const query = this.dataSource
      .getRepository(Usuario)
      .createQueryBuilder('usuario')
      .leftJoinAndSelect('usuario.usuarioRol', 'usuarioRol')
      .leftJoinAndSelect('usuarioRol.rol', 'rol')
      .leftJoinAndSelect('usuario.persona', 'persona')
      .select([
        'usuario.id',
        'usuario.usuario',
        'usuario.correoElectronico',
        'usuario.estado',
        'usuario.ciudadaniaDigital',
        'usuarioRol',
        'rol.id',
        'rol.rol',
        'persona.nroDocumento',
        'persona.nombres',
        'persona.primerApellido',
        'persona.segundoApellido',
        'persona.fechaNacimiento',
        'persona.tipoDocumento',
      ])
      .where('usuarioRol.estado = :estado', { estado: Status.ACTIVE })
      .take(limite)
      .skip(saltar)

    switch (orden) {
      case 'nroDocumento':
        query.addOrderBy('persona.nroDocumento', sentido)
        break
      case 'nombres':
        query.addOrderBy('persona.nombres', sentido)
        break
      case 'usuario':
        query.addOrderBy('usuario.usuario', sentido)
        break
      case 'rol':
        query.addOrderBy('rol.rol', sentido)
        break
      case 'estado':
        query.addOrderBy('usuario.estado', sentido)
        break
      default:
        query.addOrderBy('usuario.id', 'ASC')
    }

    if (rol) {
      query.andWhere('rol.id IN(:...roles)', {
        roles: rol,
      })
    }
    if (filtro) {
      query.andWhere(
        new Brackets((qb) => {
          qb.orWhere('usuario.usuario ilike :filtro', { filtro: `%${filtro}%` })
          qb.orWhere('persona.nroDocumento ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.nombres ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.primerApellido ilike :filtro', {
            filtro: `%${filtro}%`,
          })
          qb.orWhere('persona.segundoApellido ilike :filtro', {
            filtro: `%${filtro}%`,
          })
        })
      )
    }
    return await query.getManyAndCount()
  } */
}
