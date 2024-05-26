import { Controller, Get, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import dayjs from 'dayjs'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller()
@ApiTags('System')
export class CoreController {
  constructor(@Inject(ConfigService) private configService: ConfigService) {}

  @ApiOperation({ summary: 'API para obtener el estado de la aplicación' })
  @Get('/estado')
  verificarEstado() {
    const now = dayjs()
    return {
      entorno: this.configService.get('NODE_ENV'),
      estado: 'Servicio En FUncioniento.....',
      fecha: now.format('YYYY-MM-DD HH:mm:ss.SSS'),
      hora: now.valueOf(),
    }
  }
}
