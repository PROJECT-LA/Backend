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
} from '@nestjs/common'

import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '../dto'
import { BaseController, ParamIdDto } from '@app/common'
import { RoleService } from '../service'
import { JwtAuthGuard } from '../../auth'
import { CasbinGuard } from '../../policies'

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class RoleController extends BaseController {
  constructor(private readonly roleService: RoleService) {
    super()
  }
  @ApiOperation({ summary: 'API: para crear un rol' })
  @ApiBody({ type: CreateRoleDto })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.roleService.create(createRoleDto)
    return this.successCreate(result)
  }
  @ApiOperation({ summary: 'API: para obtener el listado de roles' })
  @Get()
  async findAll(@Query() paginationQueryDto: FilterRoleDto) {
    const result = await this.roleService.list(paginationQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API: para actulizar un rol' })
  @ApiBody({ type: UpdateRoleDto })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const { id } = param
    const result = await this.roleService.updateRole(id, updateRoleDto)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API: para eliminar un rol' })
  @Delete(':id')
  async remove(@Param() param: ParamIdDto) {
    const { id } = param
    const result = await this.roleService.deleteRole(id)
    return this.successDelete(result)
  }

  @ApiOperation({ summary: 'API: para cambiar el estado de un rol' })
  @Patch(':id/change-status')
  async changeStatus(@Param() param: ParamIdDto) {
    const { id } = param
    const result = await this.roleService.changeRoleState(id)
    return this.successUpdate(result)
  }
}
