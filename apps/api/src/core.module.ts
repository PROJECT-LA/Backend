import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { User } from './core/users/entities'
import { Role } from './core/roles/entities'
import { RefreshToken } from './core/auth/entities'
import { ModuleEntity } from './core/modules/entities'
import { ScheduleModule } from '@nestjs/schedule'
import { RoleController } from './core/roles/controller'
import { UserController } from './core/users/controller'
import { AuthController } from './core/auth/controller'
import { ModuleController } from './core/modules/controller'
import { AuthorizationController } from './core/policies/controller'
import { RoleRepository } from './core/roles/repository'
import { UserRepository } from './core/users/repository'
import { RefreshTokenRepository } from './core/auth/repository'
import { ModuleRepository } from './core/modules/repository'
import { UserService } from './core/users/service'
import { RoleService } from './core/roles/service'
import { ModuleService } from './core/modules/services'
import { AuthService } from './core/auth/service'
import { JwtStrategy } from './core/auth/strategies/jwt.strategy'
import { LocalStrategy } from './core/auth/strategies/local.strategy'
import { RefreshTokenStrategy } from './core/auth/strategies/rft.strategy'
import { PolicyService } from './core/policies/service'
import { CasbinModule } from './core/policies/config/casbin.module'
import { DataSourceConfig } from './core/db/orm-config-source'
import { SharedModule } from '@app/common'
import { MicroserviceModule } from './microservices/microservice.module'

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSourceConfig),
    TypeOrmModule.forFeature([User, Role, RefreshToken, ModuleEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRES') },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CasbinModule,
    ScheduleModule.forRoot(),
    SharedModule,
    MicroserviceModule,
  ],
  controllers: [
    RoleController,
    UserController,
    AuthController,
    ModuleController,
    AuthorizationController,
  ],
  providers: [
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    { provide: 'IRoleRepository', useClass: RoleRepository },
    {
      provide: 'IRefreshTokenRepository',
      useClass: RefreshTokenRepository,
    },
    {
      provide: 'IModuleRepository',
      useClass: ModuleRepository,
    },
    UserService,
    RoleService,
    ModuleService,
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RefreshTokenStrategy,
    ConfigService,
    PolicyService,
  ],
})
export class CoreModule {}
