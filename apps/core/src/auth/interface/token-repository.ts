import { BaseInterfaceRepository } from '@app/common'
import { RefreshToken } from '../entities'
import { DeleteResult } from 'typeorm'

export interface TokenRepositoryInterface
  extends BaseInterfaceRepository<RefreshToken> {
  removeExpiredTokens(): Promise<DeleteResult>
}
