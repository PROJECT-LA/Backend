import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { BaseController } from 'src/common'
import { CreateUpdatePoliciesDto, FilterPoliciesDto } from '../dto'
import { JwtAuthGuard } from 'src/core/auth'
import { CasbinGuard } from '../guards'
import { AuthorizationService } from '../service'

@ApiBearerAuth()
@ApiTags('Autorización')
//@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('autorizacion')
export class AuthorizationController extends BaseController {
  constructor(private authorizationService: AuthorizationService) {
    super()
  }

  @ApiOperation({ summary: 'API para crear una nueva política' })
  @ApiBody({
    type: CreateUpdatePoliciesDto,
    description: 'Crear nueva política',
    required: true,
  })
  @Post('/politicas')
  async crearPolitica(@Body() politica: CreateUpdatePoliciesDto) {
    const result = await this.authorizationService.createPolicie(politica)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar una nueva política' })
  @ApiQuery({ name: 'query' })
  @ApiBody({
    type: CreateUpdatePoliciesDto,
    description: 'Actualizar política',
    required: true,
  })
  @Patch('/politicas')
  async actualizarPolitica(
    @Body() politica: CreateUpdatePoliciesDto,
    @Query() query: CreateUpdatePoliciesDto
  ) {
    const result = await this.authorizationService.updatePolicie(
      query,
      politica
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para obtener el listado de politicas' })
  @ApiQuery({ name: 'query', type: FilterPoliciesDto })
  @Get('/politicas')
  async findAll(@Query() paginacionQueryDto: FilterPoliciesDto) {
    const result = await this.authorizationService.findAll(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para eliminar una política' })
  @Delete('/politicas')
  async eliminarPolitica(@Query() query: CreateUpdatePoliciesDto) {
    const result = await this.authorizationService.deletePolicie(query)
    return this.successDelete(result)
  }

  @ApiOperation({
    summary: 'API para obtener las politicas definidas en formato CASBIN',
  })
  @Get('/permisos')
  async obtenerRoles() {
    const result = await this.authorizationService.getRoles()
    return this.successList(result)
  }
}
