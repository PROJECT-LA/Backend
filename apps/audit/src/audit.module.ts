import { Module } from '@nestjs/common'
import { AuditController } from './audit.controller'
import { AuditService } from './audit.service'
import { ConfigModule } from '@nestjs/config'
import { SharedService } from '@app/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AuditController],
  providers: [AuditService, SharedService],
})
export class AuditModule {}
