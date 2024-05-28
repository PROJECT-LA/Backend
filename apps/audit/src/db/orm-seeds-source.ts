import { ConfigModule, ConfigService } from '@nestjs/config'
import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

ConfigModule.forRoot()
const configService = new ConfigService()

const SeedDataSource = new DataSource({
  type: 'mysql',
  host: configService.getOrThrow('DB_HOST_AUDIT'),
  port: configService.getOrThrow('DB_PORT_AUDIT'),
  username: configService.getOrThrow('DB_USERNAME_AUDIT'),
  password: configService.getOrThrow('DB_PASSWORD_AUDIT'),
  database: configService.getOrThrow('DB_NAME_AUDIT'),
  synchronize: false,
  logging: false,
  entities: [__dirname + '/../../**/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/seeds/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
})

export default SeedDataSource
