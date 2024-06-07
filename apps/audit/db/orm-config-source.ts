import { ConfigModule, ConfigService } from '@nestjs/config'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

ConfigModule.forRoot()
const configService = new ConfigService()

export const DataSourceConfig: DataSourceOptions = {
  type: 'mysql',
  host: configService.getOrThrow('DB_HOST_AUDIT'),
  port: configService.getOrThrow('DB_PORT_AUDIT'),
  username: configService.getOrThrow('DB_USERNAME_AUDIT'),
  password: configService.getOrThrow('DB_PASSWORD_AUDIT'),
  database: configService.getOrThrow('DB_NAME_AUDIT'),
  entities: [__dirname + '/../src**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
  namingStrategy: new SnakeNamingStrategy(),
}

export const AppOs = new DataSource(DataSourceConfig)
