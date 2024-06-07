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
  UseGuards,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'
import { CasbinGuard, JwtAuthGuard } from '../../guards'

@ApiTags('Levels')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('levels')
export class ApiGatewayLevelController {
  constructor(
    @Inject('AUDIT_SERVICE') private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para obtener el listado de niveles' })
  @Get()
  async list(@Query() filter: FilterLevelDto) {
    const result = this.auditService.send({ cmd: 'get-levels' }, { filter })
    return result
  }

  @ApiOperation({ summary: 'API para crear niveles' })
  @ApiBody({
    type: CreateLevelDto,
    required: true,
  })
  @Post()
  async create(@Body() createLevelDto: CreateLevelDto) {
    const result = this.auditService.send(
      { cmd: 'create-level' },
      { createLevelDto },
    )
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
  async update(@Param() param: ParamIdDto, @Body() levelDto: UpdateLevelDto) {
    const result = this.auditService.send(
      { cmd: 'update-level' },
      { param, levelDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un nivel' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.auditService.send(
      { cmd: 'change-status-level' },
      { param },
    )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un nivel de madures' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() param: ParamIdDto) {
    const result = this.auditService.send({ cmd: 'remove-level' }, { param })
    return result
  }
}
