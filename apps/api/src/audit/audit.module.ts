import { Module } from '@nestjs/common'
import { ApiGatewayParameterController } from './controllers/api-gateway-parameter.controller'
import { ApiGatewayTemplateController } from './controllers/api-gateway-template.controller'
import { ApiGatewayLevelController } from './controllers/api-gateway-level.controller'
import { ApiGatewayControlGroupController } from './controllers/api-gateway-control-group.controller'
import { ApiGatewayControlController } from './controllers/api-gateway-control.controller'

@Module({
  controllers: [
    ApiGatewayParameterController,
    ApiGatewayTemplateController,
    ApiGatewayLevelController,
    ApiGatewayControlGroupController,
    ApiGatewayControlController,
  ],
})
export class MicroserviceAuditModule {}
