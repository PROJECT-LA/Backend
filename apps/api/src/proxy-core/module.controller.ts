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

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import { ParamIdDto } from '@app/common'
import { ClientProxy } from '@nestjs/microservices'
import {
  CreateModuleDto,
  FilterModuleDto,
  UpdateModuleDto,
} from 'apps/core/src'

@ApiBearerAuth()
@ApiTags('Modules')
//@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('modules')
export class ModuleController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly moduleService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para obtener el listado de Módulos' })
  @Get()
  async list(@Query() paginacionQueryDto: FilterModuleDto) {
    const result = this.moduleService.send(
      { cmd: 'get-modules' },
      { paginacionQueryDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para crear un Módulo' })
  @ApiBody({
    type: CreateModuleDto,
    description: 'Nuevo Modulo',
    required: true,
  })
  @Post()
  async create(@Body() moduleDto: CreateModuleDto) {
    const result = await this.moduleService.send(
      { cmd: 'create-module' },
      { moduleDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar un Módulo' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateModuleDto,
    description: 'Modulo',
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() params: ParamIdDto,
    @Body() moduleDto: UpdateModuleDto,
  ) {
    const { id } = params
    const result = this.moduleService.send(
      { cmd: 'update-module' },
      { id, moduleDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un Módulo y submodulos' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() params: ParamIdDto) {
    const { id } = params
    const result = this.moduleService.send({ cmd: 'delete-module' }, { id })
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un Módulo' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/status')
  async changeStatus(@Param() params: ParamIdDto) {
    const { id } = params
    const result = this.moduleService.send(
      { cmd: 'change-status-module' },
      { id },
    )
    return result
  }
}
