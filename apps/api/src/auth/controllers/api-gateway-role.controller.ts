import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Inject,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  AUTH_SERVICE,
  CreateRoleDto,
  FilterRoleDto,
  ParamIdDto,
  UpdateRoleDto,
} from '@app/common'
import { CasbinGuard, JwtAuthGuard } from '../../guards'
import { ClientProxy } from '@nestjs/microservices'

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class ApiGatewayRoleController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
  ) {}
  @ApiOperation({ summary: 'API: para crear un rol' })
  @ApiBody({ type: CreateRoleDto })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = this.authService.send(
      { cmd: 'create-role' },
      { createRoleDto },
    )
    return result
  }
  @ApiOperation({ summary: 'API: para obtener el listado de roles' })
  @Get()
  async findAll(@Query() filter: FilterRoleDto) {
    const result = this.authService.send({ cmd: 'get-roles' }, { filter })
    return result
  }

  @ApiOperation({ summary: 'API: para actulizar un rol' })
  @ApiBody({ type: UpdateRoleDto })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const { id } = param
    const result = this.authService.send(
      { cmd: 'create-role' },
      { id, updateRoleDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API: para eliminar un rol' })
  @Delete(':id')
  async remove(@Param() param: ParamIdDto) {
    const { id } = param
    const result = this.authService.send({ cmd: 'remove-role' }, { id })
    return result
  }

  @ApiOperation({ summary: 'API: para cambiar el estado de un rol' })
  @Patch(':id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const { id } = param
    const result = this.authService.send({ cmd: 'change-status-role' }, { id })
    return result
  }
}
