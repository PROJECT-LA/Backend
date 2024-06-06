import { ConfigModule, ConfigService } from '@nestjs/config'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

ConfigModule.forRoot()
const configService = new ConfigService()

export const DataSourceConfig: DataSourceOptions = {
  type: 'mysql',
  host: configService.getOrThrow('DB_HOST_AUTH'),
  port: configService.getOrThrow('DB_PORT_AUTH'),
  username: configService.getOrThrow('DB_USERNAME_AUTH'),
  password: configService.getOrThrow('DB_PASSWORD_AUTH'),
  database: configService.getOrThrow('DB_NAME_AUTH'),
  entities: [__dirname + '/../src/**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
}

export const AppOs = new DataSource(DataSourceConfig)
