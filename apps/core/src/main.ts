import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import morgan from 'morgan'
import { CoreModule } from './core.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import cookieParser from 'cookie-parser'
import { CORS, SWAGGER_DEFAULT_CONFIG } from '@app/common'

async function bootstrap() {
  const app = await NestFactory.create(CoreModule)
  app.use(morgan('dev'))
  const configService = app.get(ConfigService)
  app.setGlobalPrefix(configService.get('API_PREFIX'))
  app.enableCors(CORS)
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  if (configService.get('NODE_ENV') !== 'production') {
    createSwagger(app, configService)
  }

  await app.listen(configService.get('PORT'))
}

export function createSwagger(
  app: INestApplication,
  configService: ConfigService,
) {
  const getConfigValue = (key: string, defaultValue: any) =>
    configService.get(key) || defaultValue

  const options = new DocumentBuilder()
    .setTitle(
      getConfigValue('SWAGER_API_TITLE', SWAGGER_DEFAULT_CONFIG.API_TITLE),
    )
    .setDescription(
      getConfigValue('SWAGER_DESCRIPTION', SWAGGER_DEFAULT_CONFIG.DESCRIPTION),
    )
    .setVersion(
      getConfigValue('SWAGER_VERSION', SWAGGER_DEFAULT_CONFIG.CURRENT_VERSION),
    )
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, options)

  SwaggerModule.setup(
    getConfigValue('SWAGER_API_ROOT', SWAGGER_DEFAULT_CONFIG.API_ROOT),
    app,
    document,
  )
}
//eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()