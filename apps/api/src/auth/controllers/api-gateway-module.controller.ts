import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import {
  CreateModuleDto,
  NewOrderDto,
  UpdateModuleDto,
  ParamIdDto,
  AUTH_SERVICE,
  GET_MODULES,
  CREATE_MODULE,
  UPDATE_MODULE,
  REMOVE_MODULE,
  CHANGE_STATUS_MODULE,
  UPDATE_ORDER_MODULES,
} from '@app/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { CasbinGuard, JwtAuthGuard } from '../../guards'
import { catchError, throwError } from 'rxjs'

@ApiBearerAuth()
@ApiTags('Modules')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('modules')
export class ApiGatewayModuleController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'API para obtener el listado de Módulos en base al rol',
  })
  @Get(':id')
  async list(@Param() param: ParamIdDto) {
    const result = this.authService
      .send({ cmd: GET_MODULES }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para crear un Módulo' })
  @ApiBody({
    type: CreateModuleDto,
    required: true,
  })
  @Post()
  async create(@Body() createModuleDto: CreateModuleDto) {
    const result = this.authService
      .send({ cmd: CREATE_MODULE }, { createModuleDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar un Módulo' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateModuleDto,
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    const result = this.authService
      .send({ cmd: UPDATE_MODULE }, { param, updateModuleDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un Módulo y submodulos' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() param: ParamIdDto) {
    const result = this.authService
      .send({ cmd: REMOVE_MODULE }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un Módulo' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.authService
      .send({ cmd: CHANGE_STATUS_MODULE }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar el orden del sidebar' })
  @ApiBody({
    type: NewOrderDto,
    required: true,
  })
  @Patch('change/order')
  async updateSidebar(@Body() orderDto: NewOrderDto) {
    const result = this.authService
      .send({ cmd: UPDATE_ORDER_MODULES }, { orderDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }
}
