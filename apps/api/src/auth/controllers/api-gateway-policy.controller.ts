import {
  AUTH_SERVICE,
  CreatePolicyDto,
  CurrentUser,
  FilterPoliciesDto,
  PassportUser,
  RouteDto,
} from '@app/common'
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CasbinGuard, JwtAuthGuard } from '../../guards'
import { catchError, throwError } from 'rxjs'

@ApiBearerAuth()
@ApiTags('Policies')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('policies')
export class ApiGatewayPolicyController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para crear una nueva política' })
  @ApiBody({
    type: CreatePolicyDto,
    description: 'Crear nueva política',
    required: true,
  })
  @Post()
  async createPolicy(@Body() policy: CreatePolicyDto) {
    const result = this.authService
      .send({ cmd: 'create-policy' }, { policy })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar una nueva política' })
  @ApiBody({
    type: CreatePolicyDto,
    description: 'Actualizar política',
    required: true,
  })
  @Patch()
  async updatePolicy(
    @Body() newPolicy: CreatePolicyDto,
    @Query() oldPolicy: CreatePolicyDto,
  ) {
    const result = this.authService
      .send({ cmd: 'update-policy' }, { oldPolicy, newPolicy })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para obtener el listado de politicas' })
  @Get()
  async getPolicies(@Query() filter: FilterPoliciesDto) {
    const result = this.authService
      .send({ cmd: 'get-policies' }, { filter })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar una política' })
  @Delete()
  async eliminarPolitica(@Query() query: CreatePolicyDto) {
    const result = this.authService
      .send({ cmd: 'remove-policy' }, { query })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({
    summary: 'API para obtener las politicas definidas en formato CASBIN',
  })
  @Post('authorization')
  async getPoliciesByRoute(
    @Body() routeDto: RouteDto,
    @CurrentUser() user: PassportUser,
  ) {
    const result = this.authService
      .send({ cmd: 'get-route-policy' }, { routeDto, user })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de una política' })
  @Patch('status')
  async changeStatusPolicy(@Body() policy: CreatePolicyDto) {
    const result = this.authService
      .send({ cmd: 'change-status-policy' }, { policy })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }
}
