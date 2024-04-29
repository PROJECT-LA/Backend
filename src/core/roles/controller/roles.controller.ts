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
import { RolesService } from '../service/roles.service'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '../dto'
import { BaseController } from 'src/common/abstract/base-controller.dto'
import { ParamIdDto } from 'src/common/dto'

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController extends BaseController {
  constructor(private readonly rolesService: RolesService) {
    super()
  }
  @ApiOperation({ summary: 'API: para crear un rol' })
  @ApiBody({ type: CreateRoleDto })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    const result = await this.rolesService.create(createRoleDto)
    return this.successCreate(result)
  }
  @ApiOperation({ summary: 'API: para obtener el listado de roles' })
  @Get()
  async findAll(@Query() paginacionQueryDto: FilterRoleDto) {
    const result = await this.rolesService.findAll(paginacionQueryDto)
    return this.successListRows(result)
  }

  @Get(':id')
  async findOne(@Param() param: ParamIdDto) {
    const { id } = param
    return await this.rolesService.findOneById(id)
  }

  @ApiOperation({ summary: 'API: para actulizar un rol' })
  @ApiBody({ type: UpdateRoleDto })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    const { id } = param
    const result = await this.rolesService.update(id, updateRoleDto)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API: para eliminar un rol' })
  @Delete(':id')
  async remove(@Param() param: ParamIdDto) {
    const { id } = param
    const result = await this.rolesService.delete(id)
    return this.successDelete(result)
  }
}
