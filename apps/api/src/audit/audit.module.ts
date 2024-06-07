import { Module } from '@nestjs/common'
import { ApiGatewayParameterController } from './controllers/api-gateway-parameter.controller'
import { ApiGatewayTemplateController } from './controllers/api-gateway-template.controller'
import { ApiGatewayLevelController } from './controllers/api-gateway-level.controller'

@Module({
  controllers: [
    ApiGatewayParameterController,
    ApiGatewayTemplateController,
    ApiGatewayLevelController,
  ],
})
export class MicroserviceAuditModule {}
