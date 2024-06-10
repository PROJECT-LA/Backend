import {
  AUTH_SERVICE,
  CHANGE_STATUS_POLICY,
  CREATE_POLICY,
  CreatePolicyDto,
  CurrentUser,
  FilterPoliciesDto,
  GET_POLICIES,
  GET_POLICIES_ROLE_FRONTEND,
  GET_ROUTE_POLICY,
  ParamIdDto,
  PassportUser,
  REMOVE_POLICY,
  RouteDto,
  UPDATE_POLICY,
} from '@app/common'
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

  @ApiOperation({ summary: 'API para obtener el listado de politicas' })
  @Get()
  async getPolicies(@Query() filter: FilterPoliciesDto) {
    const result = this.authService
      .send({ cmd: GET_POLICIES }, { filter })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para crear una nueva política' })
  @ApiBody({
    type: CreatePolicyDto,
    description: 'Crear nueva política',
    required: true,
  })
  @Post()
  async createPolicy(@Body() policy: CreatePolicyDto) {
    const result = this.authService
      .send({ cmd: CREATE_POLICY }, { policy })
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
      .send({ cmd: UPDATE_POLICY }, { oldPolicy, newPolicy })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar una política' })
  @Delete()
  async eliminarPolitica(@Query() policy: CreatePolicyDto) {
    const result = this.authService
      .send({ cmd: REMOVE_POLICY }, { policy })
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
      .send({ cmd: GET_ROUTE_POLICY }, { routeDto, user })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de una política' })
  @Patch('change-status')
  async changeStatusPolicy(@Body() policy: CreatePolicyDto) {
    const result = this.authService
      .send({ cmd: CHANGE_STATUS_POLICY }, { policy })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({
    summary:
      'API para obtener el listado de politicas frontend en base a un rol',
  })
  @Get(':id/frontend')
  async getPoliciesByRoleFrontend(@Param() param: ParamIdDto) {
    const result = this.authService
      .send({ cmd: GET_POLICIES_ROLE_FRONTEND }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }
}
