import { Module } from '@nestjs/common'
import { ApiGatewayModuleController } from './controllers/api-gateway-module.controller'
import { ApiGatewayRoleController } from './controllers/api-gateway-role.controller'
import { ApiGatewayUserController } from './controllers/api-gateway-user.controller'
import { ApiGatewayAuthController } from './controllers/api-gateway-auth.controller'
import { ApiGatewayPolicyController } from './controllers/api-gateway-policy.controller'

@Module({
  controllers: [
    ApiGatewayModuleController,
    ApiGatewayRoleController,
    ApiGatewayUserController,
    ApiGatewayAuthController,
    ApiGatewayPolicyController,
  ],
})
export class MicroservicesAuthModule {}
