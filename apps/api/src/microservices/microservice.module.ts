import { SharedModule } from '@app/common'
import { Module } from '@nestjs/common'
import { AuditController } from './audit.controller'

@Module({
  imports: [
    SharedModule.registerRmq('AUDIT_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
  ],
  controllers: [AuditController],
})
export class MicroserviceModule {}
