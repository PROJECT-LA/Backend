import { Module } from '@nestjs/common'
import { UsersModule } from './users/user.module'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module'
import { AuthorizationConfigModule } from './authorization/config/authorization.module'

@Module({
  imports: [UsersModule, RolesModule, AuthModule, AuthorizationConfigModule],
})
export class CoreModule {}
