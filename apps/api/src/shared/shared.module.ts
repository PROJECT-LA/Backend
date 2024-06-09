import { Global, Module } from '@nestjs/common'
import { AUDIT_SERVICE, AUTH_SERVICE, SharedModule } from '@app/common'

@Global()
@Module({
  imports: [
    SharedModule,
    SharedModule.registerRmq(AUTH_SERVICE, process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq(AUDIT_SERVICE, process.env.RABBITMQ_AUDIT_QUEUE),
  ],
  exports: [SharedModule],
})
export class MicroservicesSharedModule {}
