import { Module } from '@nestjs/common'
import { ApiGatewayParameterController } from './controllers/api-gateway-parameter.controller'
import { ApiGatewayTemplateController } from './controllers/api-gateway-template.controller'
import { ApiGatewayLevelController } from './controllers/api-gateway-level.controller'
import { ApiGayewayControlGroupController } from './controllers/api-gateway-control-group.controller'

@Module({
  controllers: [
    ApiGatewayParameterController,
    ApiGatewayTemplateController,
    ApiGatewayLevelController,
    ApiGayewayControlGroupController,
  ],
})
export class MicroserviceAuditModule {}
