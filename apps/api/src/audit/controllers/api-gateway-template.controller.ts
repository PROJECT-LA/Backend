import {
  CreateTemplateDto,
  FilterTemplateDto,
  ParamIdDto,
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
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ApiBody, ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger'

@ApiTags('Templates')
@Controller('templates')
export class ApiGatewayTemplateController {
  constructor(
    @Inject('AUDIT_SERVICE') private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para obtener el listado de plantillas' })
  @Get()
  async list(@Query() filter: FilterTemplateDto) {
    const result = this.auditService.send({ cmd: 'get-templates' }, { filter })
    return result
  }

  @ApiOperation({ summary: 'API para crear un nuevo plantillas' })
  @ApiBody({
    type: CreateTemplateDto,
    required: true,
  })
  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    const result = this.auditService.send(
      { cmd: 'create-template' },
      { createTemplateDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para actualizar un plantillas' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @ApiBody({
    type: UpdateTemplateDto,
    description: 'Update template',
    required: true,
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    const result = this.auditService.send(
      { cmd: 'update-template' },
      { param, updateTemplateDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para cambiae el estado de plantilla' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const result = this.auditService.send(
      { cmd: 'change-status-template' },
      { param },
    )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un plantillas' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() param: ParamIdDto) {
    const result = this.auditService.send({ cmd: 'remove-template' }, { param })
    return result
  }
}
