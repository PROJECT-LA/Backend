import { ParamIdDto } from '@app/common'
import {
  CreateLevelDto,
  FilterLevelDto,
  UpdateLevelDto,
} from '@app/common/dto/audit/level'
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

@ApiTags('Levels')
@Controller('levels')
export class ProxyLevelController {
  constructor(
    @Inject('AUDIT_SERVICE') private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para obtener el listado de niveles' })
  @Get()
  async list(@Query() paginationQueryDto: FilterLevelDto) {
    const result = this.auditService.send(
      { cmd: 'get-levels' },
      { paginationQueryDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para crear niveles' })
  @ApiBody({
    type: CreateLevelDto,
    required: true,
  })
  @Post()
  async create(@Body() levelDto: CreateLevelDto) {
    const result = this.auditService.send({ cmd: 'create-level' }, { levelDto })
    return result
  }

  @ApiOperation({ summary: 'API para actualizar niveles' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateLevelDto,
    description: 'Update template',
    required: true,
  })
  @Patch(':id')
  async update(@Param() params: ParamIdDto, @Body() levelDto: UpdateLevelDto) {
    const { id } = params
    const result = this.auditService.send(
      { cmd: 'update-level' },
      { id, levelDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un nivel' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async changeStatus(@Param() params: ParamIdDto) {
    const { id: id } = params
    const result = this.auditService.send(
      { cmd: 'change-status-level' },
      { id },
    )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un nivel de madures' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() params: ParamIdDto) {
    const { id } = params
    const result = this.auditService.send({ cmd: 'delete-level' }, { id })
    return result
  }
}
