import { Module } from '@nestjs/common'
import { AuthService } from './service/auth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './strategies/jwt.strategy'
import { LocalStrategy } from './strategies/local.strategy'
import { UsersModule } from '../users/user.module'
import { PassportModule } from '@nestjs/passport'

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRES_IN') },
      }),
    }),
    UsersModule,
    ConfigModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
