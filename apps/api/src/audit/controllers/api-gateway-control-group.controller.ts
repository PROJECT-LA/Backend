import {
  AUDIT_SERVICE,
  CreateControlGroupDto,
  FilterControlGroupDto,
  ParamIdDto,
  UpdateControlGroupDto,
} from '@app/common'
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
@ApiTags('Controls Groups')
@Controller('control-groups')
export class ApiGatewayControlGroupController {
  constructor(
    @Inject(AUDIT_SERVICE) private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'API para obtener el listado de controles de una plantilla',
  })
  @Get()
  async list(@Query() filter: FilterControlGroupDto) {
    const result = this.auditService.send(
      { cmd: 'get-control-group' },
      { filter },
    )
    return result
  }

  @ApiOperation({ summary: 'API para crear un nuevo control' })
  @ApiBody({
    type: CreateControlGroupDto,
    required: true,
  })
  @Post()
  async create(@Body() controlGroupDto: CreateControlGroupDto) {
    const result = this.auditService.send(
      { cmd: 'create-control-group' },
      { controlGroupDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar un plantillas' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateControlGroupDto,
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateControlGroupDto: UpdateControlGroupDto,
  ) {
    const result = this.auditService.send(
      { cmd: 'update-control-group' },
      { param, updateControlGroupDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un control' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/change-status-control-group')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.auditService.send(
      { cmd: 'change-status-control-group' },
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
    const result = this.auditService.send(
      { cmd: 'remove-control-group' },
      { param },
    )
    return result
  }
}
