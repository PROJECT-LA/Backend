/* import { ParamIdDto } from '@app/common'
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
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'

@ApiTags('Controls')
@Controller('controls')
export class ProxyControlController {
  constructor(
    @Inject(AUDIT_SERVICE) private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'API para obtener el listado de controles de una plantilla',
  })
  @Get()
  async list(@Query() paginationQueryDto: FilterControlDto) {
    console.log(paginationQueryDto)
    const result = this.auditService.send(
      { cmd: 'get-controls' },
      { paginationQueryDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para crear un nuevo control' })
  @ApiBody({
    type: CreateControlDto,
    description: 'Create control',
    required: true,
  })
  @Post()
  async create(@Body() controlDto: CreateControlDto) {
    const result = this.auditService.send(
      { cmd: 'create-control' },
      { controlDto },
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
    @Param() params: ParamIdDto,
    @Body() controlDto: UpdateControlDto,
  ) {
    const { id } = params
    const result = this.auditService.send(
      { cmd: 'update-control' },
      { id, controlDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un control' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async changeStatus(@Param() params: ParamIdDto) {
    const { id: id } = params
    const result = this.auditService.send(
      { cmd: 'change-status-control' },
      { id },
    )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un control' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() params: ParamIdDto) {
    const { id } = params
    const result = this.auditService.send({ cmd: 'delete-control' }, { id })
    return result
  }
}
 */
