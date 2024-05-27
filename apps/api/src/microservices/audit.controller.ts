import { Controller, Get, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Controller('audit')
export class AuditController {
  constructor(
    @Inject('AUDIT_SERVICE') private readonly auditService: ClientProxy,
  ) {}

  @Get('users')
  async getUsers() {
    return this.auditService.send(
      {
        cmd: 'get-friends',
      },
      { userId: 1 },
    )
  }
}
