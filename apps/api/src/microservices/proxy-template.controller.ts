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
export class ProxyTemplateController {
  constructor(
    @Inject('AUDIT_SERVICE') private readonly auditService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API para obtener el listado de plantillas' })
  @Get()
  async list(@Query() paginationQueryDto: FilterTemplateDto) {
    const result = this.auditService.send(
      { cmd: 'get-templates' },
      { paginationQueryDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para crear un nuevo plantillas' })
  @ApiBody({
    type: CreateTemplateDto,
    description: 'new Template',
    required: true,
  })
  @Post()
  async create(@Body() templateDto: CreateTemplateDto) {
    const result = this.auditService.send(
      { cmd: 'create-template' },
      { templateDto },
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
    @Param() params: ParamIdDto,
    @Body() templateDto: UpdateTemplateDto,
  ) {
    const { id } = params
    const result = this.auditService.send(
      { cmd: 'update-template' },
      { id, templateDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API para cambiae el estado de plantilla' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async changeStatus(@Param() params: ParamIdDto) {
    const { id: id } = params
    const result = this.auditService.send(
      { cmd: 'change-status-template' },
      { id },
    )
    return result
  }

  @ApiOperation({ summary: 'API para eliminar un plantillas' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Delete(':id')
  async delete(@Param() params: ParamIdDto) {
    const { id } = params
    const result = this.auditService.send({ cmd: 'delete-template' }, { id })
    return result
  }
}
