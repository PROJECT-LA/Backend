import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import { Request } from 'express'
import { BaseController, ParamIdDto } from 'src/common'
import { ModuleService } from '../service'
import { CreateModuleDto, FilterModuleDto, UpdateModuleDto } from '../dto'
import { JwtAuthGuard } from 'src/core/auth'
import { CasbinGuard } from '../guards'

@ApiBearerAuth()
@ApiTags('Módulos')
//@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('autorizacion/modulos')
export class ModuloController extends BaseController {
  constructor(private moduleService: ModuleService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de Módulos' })
  @Get()
  async listar(@Query() paginacionQueryDto: FilterModuleDto) {
    const result = await this.moduleService.findAll(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para crear un Módulo' })
  @ApiBody({
    type: CreateModuleDto,
    description: 'new Modulo',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() moduloDto: CreateModuleDto) {
    const result = await this.moduleService.create(moduloDto)
    return this.successCreate(result)
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
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() moduloDto: UpdateModuleDto
  ) {
    const { id: idModulo } = params
    const result = await this.moduleService.update(idModulo, moduloDto)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para eliminar un Módulo' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete()
  async eliminar(@Param('id') id: string) {
    const result = await this.moduleService.delete(id)
    return this.successDelete(result)
  }

  // activar modulo
  @ApiOperation({ summary: 'API para activar un Módulo' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/activacion')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idModulo } = params
    const result = await this.moduleService.activate(idModulo)
    return this.successUpdate(result)
  }

  // inactivar modulo
  @ApiOperation({ summary: 'API para inactivar un Módulo' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/inactivacion')
  async inactivar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idModulo } = params
    const result = await this.moduleService.inactivate(idModulo)
    return this.successUpdate(result)
  }
}
