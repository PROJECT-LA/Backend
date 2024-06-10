import { AUDIT_SERVICE, ParamIdDto } from '@app/common'
import {
  CreateControlDto,
  FilterControlDto,
  UpdateControlDto,
} from '@app/common/dto/audit/control'
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Controls')
@Controller('controls')
export class ApiGatewayControlController {
  constructor(
    @Inject(AUDIT_SERVICE) private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'API para obtener el listado de controles de un grupo de control',
  })
  @Get()
  async list(@Query() filter: FilterControlDto) {
    const result = this.auditService.send({ cmd: 'get-controls' }, { filter })
    return result
  }

  @ApiOperation({ summary: 'API para crear un nuevo control' })
  @ApiBody({
    type: CreateControlDto,
    description: 'Create control',
    required: true,
  })
  @Post()
  async create(@Body() createControlDto: CreateControlDto) {
    const result = this.auditService.send(
      { cmd: 'create-control' },
      { createControlDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar un plantillas' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateControlDto,
    description: 'Update Control',
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateControlDto: UpdateControlDto,
  ) {
    const result = this.auditService.send(
      { cmd: 'update-control' },
      { param, updateControlDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un control' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.auditService.send(
      { cmd: 'change-status-control' },
      { param },
    )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un control' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() param: ParamIdDto) {
    const result = this.auditService.send({ cmd: 'delete-control' }, { param })
    return result
  }
}
