/* import {
  CreateParameterDto,
  PaginationQueryDto,
  ParamGroupDto,
  ParamIdDto,
  UpdateParameterDto,
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
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'

@ApiTags('Parameters')
@Controller('parameters')
export class ProxyParameterController {
  constructor(
    @Inject('AUDIT_SERVICE') private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para obtener el listado de parámetros' })
  @Get()
  async list(@Query() paginationQueryDto: PaginationQueryDto) {
    const result = this.auditService.send(
      { cmd: 'get-parameters' },
      { paginationQueryDto },
    )
    return result
  }

  @ApiOperation({
    summary: 'API para obtener el listado de parámetros por grupo',
  })
  @ApiProperty({
    type: ParamGroupDto,
  })
  @Get('/:group/list')
  async findByGroup(@Param() params: ParamGroupDto) {
    const { group } = params
    const result = this.auditService.send({ cmd: 'get-groups' }, { group })
    return result
  }

  @ApiOperation({ summary: 'API para crear un nuevo parámetro' })
  @ApiBody({
    type: CreateParameterDto,
    description: 'new Parameter',
    required: true,
  })
  @Post()
  async create(@Body() parametroDto: CreateParameterDto) {
    const result = this.auditService.send(
      { cmd: 'create-parameter' },
      { parametroDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar un parámetro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateParameterDto,
    description: 'Update Parameter',
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() params: ParamIdDto,
    @Body() parametroDto: UpdateParameterDto,
  ) {
    const { id } = params
    const result = this.auditService.send(
      { cmd: 'update-parameter' },
      { id, parametroDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para activar un parámetro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async changeStatus(@Param() params: ParamIdDto) {
    const { id } = params
    const result = this.auditService.send(
      { cmd: 'change-status-parameter' },
      { id },
    )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un parametro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() params: ParamIdDto) {
    const { id } = params
    const result = this.auditService.send({ cmd: 'delete-parameter' }, { id })
    return result
  }
}
 */
