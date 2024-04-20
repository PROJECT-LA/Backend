import { ConfigModule, ConfigService } from '@nestjs/config'
import { DataSource } from 'typeorm'

ConfigModule.forRoot()
const configService = new ConfigService()

const SeedDataSource = new DataSource({
  type: 'mysql',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT'),
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_NAME'),
  synchronize: false,
  logging: false,
  entities: [__dirname + 'src/**/*.entity.ts'],
  migrations: ['database/seeds/*.ts'],
})

export default SeedDataSource
