import { ParamIdDto } from '@app/common'
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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from 'apps/core/src'

@ApiBearerAuth()
@ApiTags('Roles')
//@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('roles')
export class RoleController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API: para crear un rol' })
  @ApiBody({ type: CreateRoleDto })
  @Post('roles')
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = this.authService.send(
      { cmd: 'create-role' },
      { createRoleDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API: para obtener el listado de roles' })
  @Get('roles')
  async findAll(@Query() paginacionQueryDto: FilterRoleDto) {
    const result = this.authService.send(
      { cmd: 'get-roles' },
      { paginacionQueryDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API: para actulizar un rol' })
  @ApiBody({ type: UpdateRoleDto })
  @Patch('roles/:id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const { id } = param
    const result = this.authService.send(
      { cmd: 'update-role' },
      { id, updateRoleDto },
    )
    return result
  }
  @ApiOperation({ summary: 'API: para eliminar un rol' })
  @Delete('roles/:id')
  async remove(@Param() param: ParamIdDto) {
    const { id } = param
    const result = this.authService.send({ cmd: 'delete-role' }, { id })
    return result
    //@UseGuards(JwtAuthGuard, CasbinGuard)
  }

  @ApiOperation({ summary: 'API: para cambiar el estado de un rol' })
  @Patch('roles/:id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const { id } = param
    const result = this.authService.send({ cmd: 'change-status-role' }, { id })
    return result
  }
}
