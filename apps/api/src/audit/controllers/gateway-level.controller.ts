import { AUDIT_SERVICE, LevelMessages, ParamIdDto } from '@app/common'
import {
  CreateLevelDto,
  FilterLevelDto,
  UpdateLevelDto,
} from '@app/common/dto/audit/level'
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

@ApiTags('Levels')
@ApiBearerAuth()
//@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('levels')
export class ApiGatewayLevelController {
  constructor(
    @Inject(AUDIT_SERVICE) private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para obtener el listado de niveles' })
  @Get()
  async list(@Query() filter: FilterLevelDto) {
    const result = this.auditService.send({ cmd: 'get-levels' }, { filter })
    return result
  }

  @ApiOperation({ summary: 'API para crear niveles' })
  @ApiBody({
    type: CreateLevelDto,
    required: true,
  })
  @Post()
  async create(@Body() createLevelDto: CreateLevelDto) {
    const result = this.auditService
      .send({ cmd: LevelMessages.CREATE_LEVEL }, { createLevelDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar niveles' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateLevelDto,
    required: true,
  })
  @Patch(':id')
  async update(@Param() param: ParamIdDto, @Body() levelDto: UpdateLevelDto) {
    const result = this.auditService
      .send({ cmd: LevelMessages.UPDATE_LEVEL }, { param, levelDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )

    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un nivel' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.auditService
      .send({ cmd: LevelMessages.CHANGE_STATUS_LEVEL }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un nivel de madures' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() param: ParamIdDto) {
    const result = this.auditService.send(
      { cmd: LevelMessages.REMOVE_LEVEL },
      { param },
    )
    return result
  }
}
