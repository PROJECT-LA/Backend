import { AuditMessages } from '@app/common'
import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { cpus, totalmem, freemem } from 'os'

@Controller('healthcheck')
export class HealthCheckAuditController {
  @MessagePattern({ cmd: AuditMessages.PING })
  check() {
    const cpuCount = cpus().length
    const totalMemory = totalmem()
    const freeMemory = freemem()
    const usedMemory = totalMemory - freeMemory
    const memoryUsage = ((usedMemory / totalMemory) * 100).toFixed(2)

    return {
      status: 'PONG',
      timestamp: new Date().toISOString(),
      systemInfo: {
        cpuCount,
        totalMemory: `${totalMemory / 1024 / 1024} MB`,
        usedMemory: `${usedMemory / 1024 / 1024} MB`,
        memoryUsage: `${memoryUsage}%`,
      },
    }
  }
}
