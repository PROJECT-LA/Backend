import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { User } from './users/entities'
import { Role } from './roles/entities'
import { RefreshToken } from './auth/entities'
import { ModuleEntity } from './modules/entities'
import { ScheduleModule } from '@nestjs/schedule'
import { RoleController } from './roles/controller'
import { UserController } from './users/controller'
import { AuthController } from './auth/controller'
import { ModuleController } from './modules/controller'
import { AuthorizationController } from './policies/controller'
import { RoleRepository } from './roles/repository'
import { UserRepository } from './users/repository'
import { RefreshTokenRepository } from './auth/repository'
import { ModuleRepository } from './modules/repository'
import { UserService } from './users/service'
import { RoleService } from './roles/service'
import { ModuleService } from './modules/services'
import { AuthService } from './auth/service'
import { JwtStrategy } from './auth/strategies/jwt.strategy'
import { LocalStrategy } from './auth/strategies/local.strategy'
import { RefreshTokenStrategy } from './auth/strategies/rft.strategy'
import { PolicyService } from './policies/service'
import { CasbinModule } from './policies/config/casbin.module'
import { DataSourceConfig } from './config/data.source'

@Module({
  imports: [
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
    TypeOrmModule.forRoot(DataSourceConfig),
    CasbinModule,
    ScheduleModule.forRoot(),
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
