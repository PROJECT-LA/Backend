import { Module } from '@nestjs/common'
import { ApiGatewayParameterController } from './controllers/gateway-parameter.controller'
import { ApiGatewayTemplateController } from './controllers/gateway-template.controller'
import { ApiGatewayLevelController } from './controllers/gateway-level.controller'
import { ApiGatewayControlGroupController } from './controllers/gateway-control-group.controller'
import { ApiGatewayControlController } from './controllers/gateway-control.controller'
import { ApiGatewayAuditController } from './controllers/gateway-audit.controller'
import { ApiGatewayUserAuditController } from './controllers/gateway-user-audit.controller'
import { ApiGatewayAssessmentController } from './controllers/gateway-assessment.controller'

@Module({
  controllers: [
    ApiGatewayParameterController,
    ApiGatewayTemplateController,
    ApiGatewayLevelController,
    ApiGatewayControlGroupController,
    ApiGatewayControlController,
    ApiGatewayAuditController,
    ApiGatewayUserAuditController,
    ApiGatewayAssessmentController,
  ],
})
export class MicroserviceAuditModule {}
