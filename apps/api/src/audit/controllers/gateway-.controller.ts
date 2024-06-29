import {
  AUDIT_SERVICE,
  AssessmentMessages,
  CreateAssessmentDto,
  FilterAssessmentDto,
  ParamIdDto,
  UpdateAssessmentDTo,
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

@ApiTags('Assessment')
@ApiBearerAuth()
//@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('assessment')
export class ApiGatewayAssessmentController {
  constructor(
    @Inject(AUDIT_SERVICE) private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para obtener el listado evaluaciones' })
  @Get()
  async list(@Query() filter: FilterAssessmentDto) {
    const result = this.auditService.send(
      { cmd: AssessmentMessages.GET_ASSESSMENTS },
      { filter },
    )
    return result
  }

  @ApiOperation({ summary: 'API para crear evaluaciones' })
  @ApiBody({
    type: CreateAssessmentDto,
    required: true,
  })
  @Post()
  async create(@Body() assessmentDto: CreateAssessmentDto) {
    const result = this.auditService
      .send({ cmd: AssessmentMessages.CREATE_ASSESSMENT }, { assessmentDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar evaluaciones' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateAssessmentDTo,
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() assessmentDto: UpdateAssessmentDTo,
  ) {
    const result = this.auditService
      .send(
        { cmd: AssessmentMessages.UPDATE_ASSESSMENT },
        { param, assessmentDto },
      )
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
  @Patch(':id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.auditService
      .send({ cmd: AssessmentMessages.CHANGE_STATUS_ASSESSMENT }, { param })
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
      { cmd: AssessmentMessages.REMOVE_ASSESSMENT },
      { param },
    )
    return result
  }
}
