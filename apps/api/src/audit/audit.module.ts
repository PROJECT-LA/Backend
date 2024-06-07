import { Module } from '@nestjs/common'
import { ApiGatewayParameterController } from './controllers/api-gateway-parameter.controller'
import { ApiGatewayTemplateController } from './controllers/api-gateway-template.controller'

@Module({
  controllers: [ApiGatewayParameterController, ApiGatewayTemplateController],
})
export class MicroserviceAuditModule {}
