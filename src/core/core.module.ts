import { Module } from '@nestjs/common'
import { UsersModule } from './users/user.module'
import { RolsModule } from './rols/rols.module'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [UsersModule, RolsModule, AuthModule],
})
export class CoreModule {}
