import {
  AUDIT_SERVICE,
  ControlGroupMessages,
  CreateControlGroupDto,
  FilterControlGroupDto,
  ParamIdDto,
  UpdateControlGroupDto,
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
@ApiTags('Controls Groups')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('control-groups')
export class ApiGatewayControlGroupController {
  constructor(
    @Inject(AUDIT_SERVICE) private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'API para obtener el listado de controles en base a una plantilla',
  })
  @Get()
  async list(@Query() filter: FilterControlGroupDto) {
    const result = this.auditService
      .send({ cmd: ControlGroupMessages.GET_CONTROL_GROUPS }, { filter })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para crear un nuevo grupo de control' })
  @ApiBody({
    type: CreateControlGroupDto,
    required: true,
  })
  @Post()
  async create(@Body() controlGroupDto: CreateControlGroupDto) {
    const result = this.auditService
      .send(
        { cmd: ControlGroupMessages.CREATE_CONTROL_GROUP },
        { controlGroupDto },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar un grupo de control' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateControlGroupDto,
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() controlGroupDTo: UpdateControlGroupDto,
  ) {
    const result = this.auditService
      .send(
        { cmd: ControlGroupMessages.UPDATE_CONTROL_GROUP },
        { param, controlGroupDTo },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({
    summary: 'API para cambiar el estado de un grupo de control',
  })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.auditService
      .send(
        { cmd: ControlGroupMessages.CHANGE_STATUS_CONTROL_GROUP },
        { param },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un grupo de control' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async remove(@Param() param: ParamIdDto) {
    const result = this.auditService
      .send({ cmd: ControlGroupMessages.REMOVE_CONTROL_GROUP }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }
}
