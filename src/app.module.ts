import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './auth/users/users.module'
import { DataSourceConfig } from './common/config/data.source'
import { RolsModule } from './auth/rols/rols.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(DataSourceConfig),
    UsersModule,
    RolsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
