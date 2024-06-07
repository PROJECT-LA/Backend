import {
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
  UseGuards,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'
import { CasbinGuard, JwtAuthGuard } from '../../guards'

@ApiTags('Parameters')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('parameters')
export class ApiGatewayParameterController {
  constructor(
    @Inject('AUDIT_SERVICE') private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para obtener el listado de parámetros' })
  @Get()
  async list(@Query() filter: PaginationQueryDto) {
    const result = this.auditService.send({ cmd: 'get-parameters' }, { filter })
    return result
  }

  @ApiOperation({
    summary: 'API para obtener el listado de parámetros por grupo',
  })
  @ApiProperty({
    type: ParamGroupDto,
  })
  @Get('/:group/list')
  async findByGroup(@Param() param: ParamGroupDto) {
    const result = this.auditService.send({ cmd: 'get-groups' }, { param })
    return result
  }

  @ApiOperation({ summary: 'API para crear un nuevo parámetro' })
  @ApiBody({
    type: CreateParameterDto,
    required: true,
  })
  @Post()
  async create(@Body() createParameterDto: CreateParameterDto) {
    const result = this.auditService.send(
      { cmd: 'create-parameter' },
      { createParameterDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar un parámetro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateParameterDto,
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateParameterDto: UpdateParameterDto,
  ) {
    const result = this.auditService.send(
      { cmd: 'update-parameter' },
      { param, updateParameterDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para activar un parámetro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.auditService.send(
      { cmd: 'change-status-parameter' },
      { param },
    )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un parametro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() param: ParamIdDto) {
    const result = this.auditService.send(
      { cmd: 'remove-parameter' },
      { param },
    )
    return result
  }
}
