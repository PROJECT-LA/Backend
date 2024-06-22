import { AUDIT_SERVICE, ControlMessages, ParamIdDto } from '@app/common'
import {
  CreateControlDto,
  FilterControlDto,
  UpdateControlDto,
} from '@app/common/dto/audit/control'
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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import { CasbinGuard, JwtAuthGuard } from '../../guards'
import { catchError, throwError } from 'rxjs'

@ApiBearerAuth()
@ApiTags('Controls')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('controls')
export class ApiGatewayControlController {
  constructor(
    @Inject(AUDIT_SERVICE) private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'API para obtener el listado de controles de un grupo de control',
  })
  @Get()
  async list(@Query() filter: FilterControlDto) {
    const result = this.auditService
      .send({ cmd: ControlMessages.GET_CONTROLS }, { filter })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para crear un nuevo control' })
  @ApiBody({
    type: CreateControlDto,
    required: true,
  })
  @Post()
  async create(@Body() controlDto: CreateControlDto) {
    const result = this.auditService
      .send({ cmd: ControlMessages.CREATE_CONTROL }, { controlDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar un control' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateControlDto,
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() controlDto: UpdateControlDto,
  ) {
    const result = this.auditService
      .send({ cmd: ControlMessages.UPDATE_CONTROL }, { param, controlDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un control' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.auditService
      .send({ cmd: ControlMessages.CHANGE_STATUS_CONTROL }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un control' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async remove(@Param() param: ParamIdDto) {
    const result = this.auditService
      .send({ cmd: ControlMessages.REMOVE_CONTROL }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }
}
