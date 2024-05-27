import { Controller, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Controller()
export class AuditController {
  constructor(
    @Inject('AUDIT_SERVICE') private readonly auditService: ClientProxy,
  ) {}
}
