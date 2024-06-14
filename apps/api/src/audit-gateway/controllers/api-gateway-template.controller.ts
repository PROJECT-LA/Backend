import {
  AUDIT_SERVICE,
  CreateTemplateDto,
  FilterTemplateDto,
  LevelMessages,
  ParamIdDto,
  TemplateMessages,
  UpdateTemplateDto,
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

@ApiTags('Templates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('templates')
export class ApiGatewayTemplateController {
  constructor(
    @Inject(AUDIT_SERVICE) private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para obtener el listado de plantillas' })
  @Get()
  async list(@Query() filter: FilterTemplateDto) {
    const result = this.auditService
      .send({ cmd: TemplateMessages.GET_TEMPLATES }, { filter })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para crear una nueva plantilla' })
  @ApiBody({
    type: CreateTemplateDto,
    required: true,
  })
  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    const result = this.auditService
      .send({ cmd: TemplateMessages.CREATE_TEMPLATE }, { createTemplateDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar un plantilla' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateTemplateDto,
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    const result = this.auditService
      .send({ cmd: LevelMessages.UPDATE_LEVEL }, { param, updateTemplateDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de plantilla' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.auditService
      .send({ cmd: TemplateMessages.CHANGE_STATUS_TEMPLATE }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar una plantilla' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() param: ParamIdDto) {
    const result = this.auditService
      .send({ cmd: TemplateMessages.REMOVE_TEMPLATE }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }
}
