import { Module } from '@nestjs/common'
import { MicroserviceAuditModule } from './audit/audit.module'
import { MicroservicesAuthModule } from './auth/auth.module'
import { MicroservicesSharedModule } from './shared/shred.module'

@Module({
  imports: [
    MicroservicesSharedModule,
    MicroserviceAuditModule,
    MicroservicesAuthModule,
  ],
})
export class ApiModule {}
