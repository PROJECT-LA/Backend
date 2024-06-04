import { SharedModule } from '@app/common'
import { Module } from '@nestjs/common'
import { ProxyParameterController } from './proxy-parameter.controller'
import { ProxyTemplateController } from './proxy-template.controller'
import { ProxyControlController } from './proxy-control.controller'
import { ProxyLevelController } from './proxy-level.controller'

@Module({
  imports: [
    SharedModule.registerRmq('AUDIT_SERVICE', process.env.RABBITMQ_AUDIT_QUEUE),
  ],
  controllers: [
    ProxyParameterController,
    ProxyTemplateController,
    ProxyControlController,
    ProxyLevelController,
  ],
})
export class MicroserviceModule {}
