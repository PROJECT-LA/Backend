import { Repository } from 'typeorm'
import { User } from '../entities'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IUserRepository } from '../interface'
import { BaseRepository } from '@app/common'

/**
 * @Injectable() marca la clase como un proveedor de servicios que puede ser inyectado,
 * permitiendo que UserRepository sea gestionado por el sistema de inyección de dependencias de NestJS.
 */
@Injectable()
/**
 * UserRepository extiende BaseRepository para proporcionar operaciones específicas de repositorio
 * para la entidad User. Implementa la interfaz IUserRepository para asegurar que cumple con
 * los contratos definidos para operaciones relacionadas con los usuarios.
 */
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  /**
   * Constructor de UserRepository.
   * @InjectRepository(User) inyecta el repositorio TypeORM para la entidad User,
   * permitiendo realizar operaciones de base de datos sobre usuarios.
   *
   * @param user Repositorio de TypeORM para la entidad User.
   */
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {
    super(user)
  }
}
