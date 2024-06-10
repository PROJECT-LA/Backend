import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Inject,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  AUTH_SERVICE,
  CHANGE_STATUS_ROLE,
  CREATE_ROLE,
  CreateRoleDto,
  FilterRoleDto,
  GET_ROLES,
  ParamIdDto,
  REMOVE_ROLE,
  UPDATE_ROLE,
  UpdateRoleDto,
} from '@app/common'
import { CasbinGuard, JwtAuthGuard } from '../../guards'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { catchError, throwError } from 'rxjs'

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ApiGatewayRoleController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
  ) {}
  @ApiOperation({ summary: 'API: para crear un rol' })
  @ApiBody({ type: CreateRoleDto })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = this.authService
      .send({ cmd: CREATE_ROLE }, { createRoleDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API: para obtener el listado de roles' })
  @Get()
  async findAll(@Query() filter: FilterRoleDto) {
    const result = this.authService
      .send({ cmd: GET_ROLES }, { filter })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API: para actulizar un rol' })
  @ApiBody({ type: UpdateRoleDto })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const result = this.authService
      .send({ cmd: UPDATE_ROLE }, { param, updateRoleDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API: para eliminar un rol' })
  @Delete(':id')
  async remove(@Param() param: ParamIdDto) {
    const result = this.authService
      .send({ cmd: REMOVE_ROLE }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API: para cambiar el estado de un rol' })
  @Patch(':id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.authService
      .send({ cmd: CHANGE_STATUS_ROLE }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }
}
