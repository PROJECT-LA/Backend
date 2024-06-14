import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SharedService } from '@app/common'
import { FilesAppModule } from './files.module'

async function bootstrap() {
  const app = await NestFactory.create(FilesAppModule)
  const configService = app.get(ConfigService)
  const sharedService = app.get(SharedService)
  const queue = configService.get('RABBITMQ_FILE_QUEUE')
  app.connectMicroservice(sharedService.getRmqOptions(queue))
  app.startAllMicroservices()
}
bootstrap()
