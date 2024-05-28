import { SharedModule } from '@app/common'
import { Module } from '@nestjs/common'
import { ProxyParameterController } from './proxy-parameter.controller'

@Module({
  imports: [
    SharedModule.registerRmq('AUDIT_SERVICE', process.env.RABBITMQ_AUDIT_QUEUE),
  ],
  controllers: [ProxyParameterController],
})
export class MicroserviceModule {}
