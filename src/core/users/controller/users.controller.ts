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
import { UserService } from '../service'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { ParamIdDto } from 'src/common/dto'
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dto'
import { JwtAuthGuard } from 'src/core/auth/guards'
import { BaseController } from 'src/common'
import { CasbinGuard } from 'src/core/authorization'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class UsersController extends BaseController {
  constructor(private readonly usersService: UserService) {
    super()
  }
  @ApiOperation({ summary: 'API: para crear un usuario' })
  @ApiBody({ type: CreateUserDto })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API: para obtener el listado de usuarios' })
  @Get()
  async findAll(@Query() paginacionQueryDto: FilterUserDto) {
    const result = await this.usersService.findAll(paginacionQueryDto)
    return await this.successListRows(result)
  }

  @ApiOperation({ summary: 'API: para obtener un usuario' })
  @Get(':id')
  async findOne(@Param() param: ParamIdDto) {
    const { id } = param
    return await this.usersService.findOneById(id)
  }

  @ApiOperation({ summary: 'API: para actulizar un usuario' })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const { id } = param
    const result = await this.usersService.update(id, updateUserDto)
    console.log(result)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API: para borrar un usuario' })
  @Delete(':id')
  remove(@Param() param: ParamIdDto) {
    const { id } = param
    const result = this.usersService.delete(id)
    return this.successDelete(result)
  }
}
