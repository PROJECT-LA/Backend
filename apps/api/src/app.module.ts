import { Module } from '@nestjs/common'
import { SharedModule } from '@app/common'
import { PassportModule } from '@nestjs/passport'
import { ConfigModule, ConfigService } from '@nestjs/config'
import {
  ModuleController,
  PolicyController,
  RoleController,
  UserController,
} from './proxy-core'
@Module({
  imports: [
    PassportModule,
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    RoleController,
    UserController,
    PolicyController,
    ModuleController,
  ],
  providers: [ConfigService],
})
export class AppModule {}
