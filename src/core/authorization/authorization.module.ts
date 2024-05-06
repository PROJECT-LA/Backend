import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthorizationController } from './controller/authorization.controller'
import { AuthorizationService } from './service/authorization.service'
import { ModuloController } from './controller/modulo.controller'
import { ModuleService } from './service'
import { ModuleRepository } from './repository'
import { AuthorizationConfigModule } from './config/authorization.module'
@Module({
  imports: [
    TypeOrmModule.forFeature([Module]),
    ConfigModule,
    AuthorizationConfigModule,
  ],
  exports: [AuthorizationService],
  controllers: [AuthorizationController, ModuloController],
  providers: [
    ModuleService,
    ConfigService,
    AuthorizationService,
    ModuleRepository,
  ],
})
export class AuthorizationModule {}
