import {
  Body,
  Controller,
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
import { BaseController, PaginationQueryDto, ParamIdDto } from 'src/common'
import { ParameterService } from '../service'
import { CreateParameterDto, ParamGroupDto, UpdateParameterDto } from '../dto'

@ApiTags('Parameter')
@ApiBearerAuth()
@Controller('parameters')
//@UseGuards(JwtAuthGuard, CasbinGuard)
export class ParameterController extends BaseController {
  constructor(private parameterService: ParameterService) {
    super()
  }

  @ApiOperation({ summary: 'API para obtener el listado de parámetros' })
  @Get()
  async listar(@Query() paginacionQueryDto: PaginationQueryDto) {
    const result = await this.parameterService.findAll(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({
    summary: 'API para obtener el listado de parámetros por group',
  })
  @ApiProperty({
    type: ParamGroupDto,
  })
  @Get('/:group/list')
  async findByGroup(@Param() params: ParamGroupDto) {
    const { group } = params
    const result = await this.parameterService.findByGroup(group)
    return this.successList(result)
  }

  @ApiOperation({ summary: 'API para crear un nuevo parámetro' })
  @ApiBody({
    type: CreateParameterDto,
    description: 'new Parametro',
    required: true,
  })
  @Post()
  async crear(@Req() req: Request, @Body() parametroDto: CreateParameterDto) {
    const result = await this.parameterService.create(parametroDto)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar un parámetro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateParameterDto,
    description: 'new Rol',
    required: true,
  })
  @Patch(':id')
  async actualizar(
    @Param() params: ParamIdDto,
    @Req() req: Request,
    @Body() parametroDto: UpdateParameterDto
  ) {
    const { id: idParameter } = params
    const result = await this.parameterService.update(idParameter, parametroDto)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para activar un parámetro' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async activar(@Req() req: Request, @Param() params: ParamIdDto) {
    const { id: idParameter } = params
    const result = await this.parameterService.changeStatus(idParameter)
    return this.successUpdate(result)
  }
}
