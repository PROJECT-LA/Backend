import {
  AUDIT_SERVICE,
  CreatePersonalDto,
  FilterUserAuditDto,
  ParamIdDto,
  UserAuditMessages,
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
} from '@nestjs/common'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import { catchError, throwError } from 'rxjs'

@ApiTags('User Audits')
@ApiBearerAuth()
//@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('user-audits')
export class ApiGatewayUserAuditController {
  constructor(
    @Inject(AUDIT_SERVICE) private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para obtener el listado de auditorias' })
  @Get()
  async list(@Query() filter: FilterUserAuditDto) {
    const result = this.auditService.send(
      { cmd: UserAuditMessages.GET_USERS_AUDIT },
      { filter },
    )
    return result
  }

  @ApiOperation({ summary: 'API para asignar usarios a una auditoria' })
  @ApiBody({
    type: CreatePersonalDto,
    required: true,
  })
  @Post()
  async create(@Body() personalDto: CreatePersonalDto) {
    const result = this.auditService
      .send({ cmd: UserAuditMessages.CREATE_USER_AUDIT }, { personalDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({
    summary:
      'API para cambiar el estado de un usuario asignado a una auditoria',
  })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.auditService
      .send({ cmd: UserAuditMessages.CHANGE_STATUS_AUDIT }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un auditor asignado' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() param: ParamIdDto) {
    const result = this.auditService.send(
      { cmd: UserAuditMessages.REMOVE_USER_AUDIT },
      { param },
    )
    return result
  }
}
