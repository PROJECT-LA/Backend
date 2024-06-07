import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Inject,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger'
import {
  CreateUserDto,
  FilterUserDto,
  UpdateProfileDto,
  UpdateUserDto,
  ChangePaswwordDto,
  ParamIdDto,
  imageFileFilter,
  AVATAR_UPLOAD_CONFIG,
  AUTH_SERVICE,
} from '@app/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ClientProxy } from '@nestjs/microservices'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
//@UseGuards(JwtAuthGuard, CasbinGuard)
export class ApiGatewayUserController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
  ) {}

  @ApiOperation({ summary: 'API: para crear un usuario' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageFileFilter,
      limits: {
        fileSize: AVATAR_UPLOAD_CONFIG.MAX_SIZE,
        files: AVATAR_UPLOAD_CONFIG.MAX_FILES,
      },
    }),
  )
  @Post()
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    const result = this.authService.send(
      { cmd: 'create-user' },
      { createUserDto, image },
    )
    return result
  }

  @ApiOperation({ summary: 'API: para obtener el listado de usuarios' })
  @Get()
  async findAll(@Query() filter: FilterUserDto) {
    const result = this.authService.send({ cmd: 'get-users' }, { filter })
    return result
  }

  @ApiOperation({ summary: 'API: para obtener un usuario' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Get(':id')
  async getCurrentUser(@Param() param: ParamIdDto) {
    const result = this.authService.send({ cmd: 'get-user' }, { param })
    return result
  }

  @ApiOperation({ summary: 'API: para actulizar un usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id')
  async update(
    @Param() param: ParamIdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = this.authService.send(
      { cmd: 'update-user' },
      { param, updateUserDto },
    )
    return result
  }

  @ApiOperation({ summary: 'API: para actulizar el perfil de usuario' })
  @Patch(':id/update-profile')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateProfileDto })
  @ApiProperty({
    type: ParamIdDto,
  })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageFileFilter,
      limits: {
        fileSize: AVATAR_UPLOAD_CONFIG.MAX_SIZE,
        files: AVATAR_UPLOAD_CONFIG.MAX_FILES,
      },
    }),
  )
  async updateProfile(
    @Param() param: ParamIdDto,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const result = this.authService.send(
      { cmd: 'update-profile' },
      { param, updateProfileDto, image },
    )
    return result
  }

  @ApiOperation({ summary: 'API: para borrar un usuario' })
  @Delete(':id')
  remove(@Param() param: ParamIdDto) {
    const result = this.authService.send({ cmd: 'remove-user' }, { param })
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un usuario' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async activar(@Param() param: ParamIdDto) {
    const result = this.authService.send(
      { cmd: 'change-status-user' },
      { param },
    )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar la contraseña de usuario' })
  @ApiBody({ type: ChangePaswwordDto })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-password')
  async changePassword(
    @Param() param: ParamIdDto,
    @Body() changePaswwordDto: ChangePaswwordDto,
  ) {
    const result = await this.authService.send(
      { cmd: 'change-password' },
      { param, changePaswwordDto },
    )
    return result
  }
}
