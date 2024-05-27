import { PassportUser } from '@app/common'
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreatePolicyDto, FilterPoliciesDto, RouteDto } from 'apps/core/src'
import { CurrentUser } from 'apps/core/src/auth/decorators'

@ApiBearerAuth()
@ApiTags('Policies')
//@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('policies')
export class PolicyController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para crear una nueva política' })
  @ApiBody({
    type: CreatePolicyDto,
    description: 'Crear nueva política',
    required: true,
  })
  @Post('policies')
  async createPolicy(@Body() policy: CreatePolicyDto) {
    const result = this.authService.send({ cmd: 'create-policy' }, { policy })
    return result
  }

  @ApiOperation({ summary: 'API para actualizar una nueva política' })
  @ApiBody({
    type: CreatePolicyDto,
    description: 'Actualizar política',
    required: true,
  })
  @Patch('policies')
  async updatePolicy(
    @Body() policy: CreatePolicyDto,
    @Query() query: CreatePolicyDto,
  ) {
    const result = this.authService.send(
      { cmd: 'update-policy' },
      { query, policy },
    )
    return result
  }

  @ApiOperation({ summary: 'API para obtener el listado de politicas' })
  @Get('policies')
  async findAllPolicies(@Query() paginacionQueryDto: FilterPoliciesDto) {
    const result = this.authService.send(
      { cmd: 'get-policies' },
      { paginacionQueryDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar una política' })
  @Delete('policies')
  async deletePolicy(@Query() query: CreatePolicyDto) {
    const result = this.authService.send({ cmd: 'delete-policy' }, { query })
    return result
  }

  @ApiOperation({
    summary: 'API para obtener las politicas definidas en formato CASBIN',
  })
  @Post('policies/authorization')
  async getPoliciesByRoute(
    @Body() routeDto: RouteDto,
    @CurrentUser() user: PassportUser,
  ) {
    const { route } = routeDto
    const result = this.authService.send(
      { cmd: 'get-authorization' },
      { route, user },
    )
    return result
  }
  @ApiOperation({ summary: 'API para cambiar el estado de una política' })
  @Patch('policies/status')
  async changeStatusPolicy(@Body() policy: CreatePolicyDto) {
    const result = this.authService.send(
      { cmd: 'change-status-policy' },
      { policy },
    )
    return result
  }
}
