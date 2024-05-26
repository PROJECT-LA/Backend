import TypeORMAdapter from 'typeorm-adapter'
import { Module } from '@nestjs/common'
import { AUTHZ_ENFORCER, AuthZModule } from 'nest-authz'
import { join } from 'path'
import { newEnforcer } from 'casbin'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule,
    AuthZModule.register({
      imports: [ConfigModule],
      enforcerProvider: {
        provide: AUTHZ_ENFORCER,
        useFactory: async (configService: ConfigService) => {
          const adapter = await TypeORMAdapter.newAdapter({
            type: 'mysql',
            host: configService.get('DB_HOST_AUTH'),
            port: configService.get('DB_PORT_AUTH'),
            username: configService.get('DB_USERNAME_AUTH'),
            password: configService.get('DB_PASSWORD_AUTH'),
            database: configService.get('DB_NAME_AUTH'),
            logging: false,
            synchronize: false,
          })
          const enforcer = await newEnforcer(
            join(__dirname, 'model.conf'),
            adapter,
          )
          enforcer.enableLog(false)
          await enforcer.loadPolicy()
          return enforcer
        },
        inject: [ConfigService],
      },
      usernameFromContext: (ctx) => {
        const request = ctx.switchToHttp().getRequest()
        return request.user && request.user.username
      },
    }),
  ],
})
export class CasbinModule {}
