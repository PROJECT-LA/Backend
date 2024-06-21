import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserAudit } from '../entities'
import { IUserAuditRepository } from '../interface'
import { BaseRepository } from '@app/common'

@Injectable()
export class UserAuditRepository
  extends BaseRepository<UserAudit>
  implements IUserAuditRepository
{
  constructor(
    @InjectRepository(UserAudit)
    private readonly userAuditRepository: Repository<UserAudit>,
  ) {
    super(userAuditRepository)
  }
}
