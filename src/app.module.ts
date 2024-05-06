import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSourceConfig } from './common/config/data.source'
import { CoreModule } from './core/core.module'
import { ApplicationModule } from './application'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(DataSourceConfig),
    CoreModule,
    ApplicationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
