import { NestFactory } from '@nestjs/core'
import { CoreModule } from './core.module'
import { ConfigService } from '@nestjs/config'
import { SharedService } from '@app/common'

async function bootstrap() {
  const app = await NestFactory.create(CoreModule)
  const configService = app.get(ConfigService)
  const sharedService = app.get(SharedService)
  const queue = configService.get('RABBITMQ_AUTH_QUEUE')
  app.connectMicroservice(sharedService.getRmqOptions(queue))
  app.startAllMicroservices()
}
bootstrap()

/* export function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_DEFAULT_CONFIG.API_TITLE)
    .setDescription(SWAGGER_DEFAULT_CONFIG.DESCRIPTION)
    .setVersion(SWAGGER_DEFAULT_CONFIG.CURRENT_VERSION)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup(SWAGGER_DEFAULT_CONFIG.API_ROOT, app, document)
} */
//eslint-disable-next-line @typescript-eslint/no-floating-promises
