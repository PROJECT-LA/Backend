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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import { CreateUserDto, FilterUserDto, UpdateUserDto } from 'apps/core/src'

@ApiBearerAuth()
@ApiTags('Users')
//@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('users')
export class UserController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API: para crear un usuario' })
  @ApiBody({ type: CreateUserDto })
  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const result = this.authService.send(
      { cmd: 'create-user' },
      { createUserDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API: para obtener el listado de usuarios' })
  @Get('users')
  async findAllUser(@Query() paginacionQueryDto: FilterUserDto) {
    const result = this.authService.send(
      { cmd: 'get-users' },
      { paginacionQueryDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API: para actulizar un usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('users/:id')
  async updateUser(
    @Param() param: ParamIdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id } = param
    const result = this.authService.send(
      { cmd: 'update-user' },
      { id, updateUserDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API: para borrar un usuario' })
  @Delete('users/:id')
  removeUser(@Param() param: ParamIdDto) {
    const { id } = param
    const result = this.authService.send({ cmd: 'delete-user' }, { id })
    return result
  }
  @ApiOperation({ summary: 'API para cambiar el estado de un usuario' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async activar(@Param() params: ParamIdDto) {
    const { id: idUser } = params
    const result = this.authService.send(
      { cmd: 'change-status-user' },
      { idUser },
    )
    return result
  }
}
