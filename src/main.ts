import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import morgan from 'morgan'
import { CORS, SWAGGER_DEFAULT_CONFIG } from './common/constants'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(morgan('dev'))
  const configService = app.get(ConfigService)
  app.setGlobalPrefix(configService.get('API_PREFIX'))
  app.enableCors(CORS)
  app.useGlobalPipes(new ValidationPipe())
  if (configService.get('NODE_ENV') !== 'production') {
    createSwagger(app, configService)
  }

  await app.listen(configService.get('PORT'))
}

export function createSwagger(
  app: INestApplication,
  configService: ConfigService
) {
  const getConfigValue = (key: string, defaultValue: any) =>
    configService.get(key) || defaultValue

  const options = new DocumentBuilder()
    .setTitle(
      getConfigValue('SWAGER_API_TITLE', SWAGGER_DEFAULT_CONFIG.API_TITLE)
    )
    .setDescription(
      getConfigValue('SWAGER_DESCRIPTION', SWAGGER_DEFAULT_CONFIG.DESCRIPTION)
    )
    .setVersion(
      getConfigValue('SWAGER_VERSION', SWAGGER_DEFAULT_CONFIG.CURRENT_VERSION)
    )
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup(
    getConfigValue('SWAGER_API_ROOT', SWAGGER_DEFAULT_CONFIG.API_ROOT),
    app,
    document
  )
}
//eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
