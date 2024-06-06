import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SharedService } from '@app/common'
import { AuthModule } from './auth.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)
  const configService = app.get(ConfigService)
  const sharedService = app.get(SharedService)
  const queue = configService.get('RABBITMQ_AUTH_QUEUE')
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.connectMicroservice(sharedService.getRmqOptions(queue))
  app.startAllMicroservices()
}
bootstrap()
