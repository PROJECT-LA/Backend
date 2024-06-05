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

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController, PassportUser } from '@app/common'
import { CreatePolicyDto, FilterPoliciesDto, RouteDto } from '../dto'
import { CasbinGuard } from '../guards'
import { PolicyService } from '../service'
import { JwtAuthGuard } from '../../access-tokens'
import { CurrentUser } from '../../access-tokens/decorators'

@ApiBearerAuth()
@ApiTags('Policies')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('policies')
export class AuthorizationController extends BaseController {
  constructor(private policyService: PolicyService) {
    super()
  }

  @ApiOperation({ summary: 'API para crear una nueva política' })
  @ApiBody({
    type: CreatePolicyDto,
    description: 'Crear nueva política',
    required: true,
  })
  @Post()
  async createPolicy(@Body() policy: CreatePolicyDto) {
    const result = await this.policyService.createPolicie(policy)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API para actualizar una nueva política' })
  @ApiBody({
    type: CreatePolicyDto,
    description: 'Actualizar política',
    required: true,
  })
  @Patch()
  async updatePolicy(
    @Body() policy: CreatePolicyDto,
    @Query() query: CreatePolicyDto,
  ) {
    const result = await this.policyService.updatePolicie(query, policy)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para obtener el listado de politicas' })
  @Get()
  async findAllPolicies(@Query() paginationQueryDto: FilterPoliciesDto) {
    const result = await this.policyService.findAll(paginationQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API para eliminar una política' })
  @Delete()
  async eliminarPolitica(@Query() query: CreatePolicyDto) {
    const result = await this.policyService.deletePolicie(query)
    return this.successDelete(result)
  }

  @ApiOperation({
    summary: 'API para obtener las politicas definidas en formato CASBIN',
  })
  @Post('authorization')
  async getPoliciesByRoute(
    @Body() routeDto: RouteDto,
    @CurrentUser() user: PassportUser,
  ) {
    const { route } = routeDto
    const result = await this.policyService.getPoliciesByRoute(route, user)
    return this.successList(result)
  }

  @ApiOperation({ summary: 'API para cambiar el estado de una política' })
  @Patch('status')
  async changeStatusPolicy(@Body() policy: CreatePolicyDto) {
    const result = await this.policyService.changeStatusPolicy(policy)
    return this.successUpdate(result)
  }
}
