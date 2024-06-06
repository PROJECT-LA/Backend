import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { SharedModule } from '@app/common'
import { DataSourceConfig } from '../db/orm-config-source'

@Module({
  imports: [
    TypeOrmModule.forRoot(DataSourceConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    SharedModule,
    SharedModule.registerRmq('FILE_SERVICE', process.env.RABBITMQ_FILE_QUEUE),
  ],
})
export class AuthModule {}
