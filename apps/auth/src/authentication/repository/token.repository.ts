import { DeleteResult, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { RefreshToken } from '../entities'
import { BaseRepository } from '@app/common'

import { InjectRepository } from '@nestjs/typeorm'
import { TokenRepositoryInterface } from '../interface'

@Injectable()
export class RefreshTokenRepository
  extends BaseRepository<RefreshToken>
  implements TokenRepositoryInterface
{
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshToken: Repository<RefreshToken>,
  ) {
    super(refreshToken)
  }
  async removeExpiredTokens(): Promise<DeleteResult> {
    const now: Date = new Date()
    console.log('now')
    return await this.refreshToken
      .createQueryBuilder('RefreshTokens')
      .delete()
      .from(RefreshToken)
      .where('exp < :now', { now })
      .execute()
  }
}
