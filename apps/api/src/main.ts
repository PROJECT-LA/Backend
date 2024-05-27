import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { CORS, SWAGGER_DEFAULT_CONFIG } from '@app/common'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import morgan from 'morgan'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(morgan('dev'))
  const configService = app.get(ConfigService)
  app.enableCors(CORS)
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  if (configService.get('NODE_ENV') !== 'production') {
    createSwagger(app)
  }
  await app.listen(configService.get('PORT'))
}

export function createSwagger(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle(SWAGGER_DEFAULT_CONFIG.API_TITLE)
    .setDescription(SWAGGER_DEFAULT_CONFIG.DESCRIPTION)
    .setVersion(SWAGGER_DEFAULT_CONFIG.CURRENT_VERSION)
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup(SWAGGER_DEFAULT_CONFIG.API_ROOT, app, document)
}
bootstrap()
