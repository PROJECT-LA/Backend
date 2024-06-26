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
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {
    super(user)
  }
}
