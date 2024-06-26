import { AUDIT_SERVICE, AuditMessages, ParamIdDto } from '@app/common'
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
import {
  AuditStatusDto,
  CreateAuditDto,
  FilterAuditDto,
  UpdateAuditDto,
} from '@app/common/dto/audit/audit'

@ApiBearerAuth()
@ApiTags('Audits')
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('audits')
export class ApiGatewayAuditController {
  constructor(
    @Inject(AUDIT_SERVICE) private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({
    summary: 'API para obtener el listado de auditorias',
  })
  @Get()
  async list(@Query() filter: FilterAuditDto) {
    console.log(filter)
    const result = this.auditService
      .send({ cmd: AuditMessages.GET_AUDIT }, { filter })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para crear un nuevo control' })
  @ApiBody({
    type: CreateAuditDto,
    required: true,
  })
  @Post()
  async create(@Body() createAuditDto: CreateAuditDto) {
    const result = this.auditService
      .send({ cmd: AuditMessages.CREATE_AUDIT }, { createAuditDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar una audit' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateAuditDto,
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateAuditDto: UpdateAuditDto,
  ) {
    const result = this.auditService
      .send({ cmd: AuditMessages.UPDATE_AUDIT }, { param, updateAuditDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de una auditoria' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/change-status')
  async changeStatus(
    @Param() param: ParamIdDto,
    @Body() auditStatus: AuditStatusDto,
  ) {
    const result = this.auditService
      .send({ cmd: AuditMessages.CHANGE_STATUS_AUDIT }, { param, auditStatus })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar una auditoria' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async remove(@Param() param: ParamIdDto) {
    const result = this.auditService
      .send({ cmd: AuditMessages.REMOVE_AUDIT }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }
}
