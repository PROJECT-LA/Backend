import { Module } from '@nestjs/common'
import { ApiGatewayModuleController } from './controllers/gateway-module.controller'
import { ApiGatewayRoleController } from './controllers/gateway-role.controller'
import { ApiGatewayUserController } from './controllers/gateway-user.controller'
import { ApiGatewayAuthController } from './controllers/gateway-auth.controller'
import { ApiGatewayPolicyController } from './controllers/gateway-policy.controller'

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
