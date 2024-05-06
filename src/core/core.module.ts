import { Module } from '@nestjs/common'
import { UsersModule } from './users/user.module'
import { AuthModule } from './auth/auth.module'
import { RolesModule } from './roles/roles.module'
import { AuthorizationModule } from './authorization'

@Module({
  imports: [UsersModule, RolesModule, AuthModule, AuthorizationModule],
})
export class CoreModule {}
