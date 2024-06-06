import { Global, Module } from '@nestjs/common'
import { UserRepository } from './users/repository'
import { RoleRepository } from './roles/repository'
import { RefreshTokenRepository } from './token/repository'
import { ModuleRepository } from './modules/repository'

@Global()
@Module({
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IRoleRepository',
      useClass: RoleRepository,
    },
    {
      provide: 'IRefreshTokenRepository',
      useClass: RefreshTokenRepository,
    },
    {
      provide: 'IModuleRepository',
      useClass: ModuleRepository,
    },
  ],
  exports: [
    'IUserRepository',
    'IRoleRepository',
    'IRefreshTokenRepository',
    'IModuleRepository',
  ],
})
export class RepoModule {}
