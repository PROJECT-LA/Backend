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
  constructor(
    @InjectRepository(Role)
    private readonly role: Repository<Role>,
  ) {
    super(role)
  }
}
