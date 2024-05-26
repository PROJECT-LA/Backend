import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController, ParamIdDto } from '@app/common'
import { ModuleService } from '../services'
import { CreateModuleDto, FilterModuleDto, UpdateModuleDto } from '../dto'
import { JwtAuthGuard } from '../../auth'
import { CasbinGuard } from '../../policies'

@ApiBearerAuth()
@ApiTags('Modules')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('modules')
export class ModuleController extends BaseController {
  constructor(private moduleService: ModuleService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de Módulos' })
  @Get()
  async list(@Query() paginacionQueryDto: FilterModuleDto) {
    const result = await this.moduleService.list(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para crear un Módulo' })
  @ApiBody({
    type: CreateModuleDto,
    description: 'Nuevo Modulo',
    required: true,
  })
  @Post()
  async create(@Body() moduleDto: CreateModuleDto) {
    const result = await this.moduleService.create(moduleDto)
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
  async update(
    @Param() params: ParamIdDto,
    @Body() moduleDto: UpdateModuleDto,
  ) {
    const { id: idModule } = params
    const result = await this.moduleService.update(idModule, moduleDto)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para eliminar un Módulo y submodulos' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const result = await this.moduleService.delete(id)
    return this.successDelete(result)
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un Módulo' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/status')
  async changeStatus(@Param() params: ParamIdDto) {
    const { id: idModule } = params
    const result = await this.moduleService.changeStatus(idModule)
    return this.successUpdate(result)
  }
}