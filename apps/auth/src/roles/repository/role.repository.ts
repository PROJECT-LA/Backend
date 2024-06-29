import { Repository } from 'typeorm'
import { Role } from '../entities'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { IRoleRepository } from '../interface'

@Injectable()
export class RoleRepository
  extends BaseRepository<Role>
  implements IRoleRepository
{
  /**
   * Constructor de RoleRepository.
   * @InjectRepository(Role) inyecta el repositorio TypeORM para la entidad Role,
   * permitiendo realizar operaciones de base de datos sobre roles.
   *
   * @param role Repositorio de TypeORM para la entidad Role.
   */
  constructor(
    @InjectRepository(Role)
    private readonly role: Repository<Role>,
  ) {
    super(role)
  }
}
