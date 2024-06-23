import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Audit } from '../entities'
import { IAuditRepository } from '../interface'

@Injectable()
export class AuditRepository
  extends BaseRepository<Audit>
  implements IAuditRepository
{
  constructor(
    @InjectRepository(Audit)
    private readonly audit: Repository<Audit>,
  ) {
    super(audit)
  }
}
