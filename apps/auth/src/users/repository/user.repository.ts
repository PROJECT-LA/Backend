import { Repository } from 'typeorm'
import { User } from '../entities'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IUserRepository } from '../interface'
import { BaseRepository } from '@app/common'

@Injectable()
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
