import { Module } from '@nestjs/common'
import { MicroserviceAuditModule } from './audit-gateway/audit.module'
import { MicroservicesAuthModule } from './auth-gateway/auth.module'
import { GlobalModule } from './global/global.module'

@Module({
  imports: [GlobalModule, MicroserviceAuditModule, MicroservicesAuthModule],
})
export class ApiModule {}
