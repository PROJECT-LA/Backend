import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DataSourceConfig } from '../db/orm-config-source'
import { User } from './users/entities'
import { Role } from './roles/entities'
import { ModuleEntity } from './modules/entities'
import { CasbinModule } from './policies/config'
import { FILE_SERVICE, SharedModule, SharedService } from '@app/common'
import { ScheduleModule } from '@nestjs/schedule'
import { RoleController } from './roles/controller'
import { UserController } from './users/controller'
import { ModuleController } from './modules/controller'
import { UserRepository } from './users/repository'
import { RoleRepository } from './roles/repository'
import { ModuleRepository } from './modules/repository'
import { UserService } from './users/service'
import { RoleService } from './roles/service'
import { ModuleService } from './modules/services'
import { PolicyService } from './policies/service'
import { PolicyController } from './policies/controller'
import { AuthenticationController } from './authentication/controller'
import { AuthenticationService } from './authentication/service'
import { HealthCheckController } from './external/health-check.controller'
import { ExternalFileService } from './external/external-file.service'

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSourceConfig),
    TypeOrmModule.forFeature([User, Role, ModuleEntity]),
    ScheduleModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRES_IN') },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    CasbinModule,
    SharedModule.registerRmq(FILE_SERVICE, process.env.RABBITMQ_FILE_QUEUE),
  ],
  controllers: [
    UserController,
    RoleController,
    ModuleController,
    PolicyController,
    AuthenticationController,
    HealthCheckController,
  ],
  providers: [
    ConfigService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    { provide: 'IRoleRepository', useClass: RoleRepository },
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
    {
      provide: 'IModuleRepository',
      useClass: ModuleRepository,
    },
    UserService,
    RoleService,
    ModuleService,
    ExternalFileService,
    PolicyService,
    AuthenticationService,
  ],
})
export class AuthModule {}
