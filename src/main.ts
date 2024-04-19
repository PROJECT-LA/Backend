import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import * as morgan from 'morgan'
import { CORS } from './common/constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(morgan('dev'))
  const configService = app.get(ConfigService)
  app.setGlobalPrefix(configService.get('API_PREFIX'))
  app.enableCors(CORS)
  await app.listen(configService.get('PORT'))
}
bootstrap()
