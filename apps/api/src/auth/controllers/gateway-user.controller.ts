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
  UseGuards,
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
  UserMessages,
  CurrentUser,
  PassportUser,
} from '@app/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ClientProxy, RpcException } from '@nestjs/microservices'
import { CasbinGuard, JwtAuthGuard } from '../../guards'
import { catchError, throwError } from 'rxjs'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, CasbinGuard)
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
    const result = this.authService
      .send({ cmd: UserMessages.CREATE_USER }, { createUserDto, image })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API: para obtener el listado de usuarios' })
  @Get()
  async findAll(@Query() filter: FilterUserDto) {
    const result = this.authService
      .send({ cmd: UserMessages.GET_USERS }, { filter })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({
    summary: 'API: para obtener el listado de usuarios por role',
  })
  @Get(':id/role')
  async getUsersByRole(@Param() param: ParamIdDto) {
    const result = this.authService
      .send({ cmd: UserMessages.GET_USERS_BY_ROLE }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API: para obtener un usuario' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Get(':id')
  async getCurrentUser(@Param() param: ParamIdDto) {
    const result = this.authService
      .send({ cmd: UserMessages.GET_USER }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API: para actulizar un usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id')
  async update(
    @CurrentUser() user: PassportUser,
    @Param() param: ParamIdDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = this.authService
      .send({ cmd: UserMessages.UPDATE_USER }, { param, updateUserDto, user })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
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
    const result = this.authService
      .send(
        { cmd: UserMessages.UPDATE_PROFILE },
        { param, updateProfileDto, image },
      )
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API: para borrar un usuario' })
  @Delete(':id')
  remove(@CurrentUser() user: PassportUser, @Param() param: ParamIdDto) {
    const result = this.authService
      .send({ cmd: UserMessages.REMOVE_USER }, { param, user })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un usuario' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/change-status')
  async activar(@CurrentUser() user: PassportUser, @Param() param: ParamIdDto) {
    const result = this.authService
      .send({ cmd: UserMessages.CHANGE_STATUS_USER }, { param, user })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para cambiar la contraseña de usuario' })
  @ApiBody({ type: ChangePaswwordDto })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/change-password')
  async changePassword(
    @Param() param: ParamIdDto,
    @Body() changePaswwordDto: ChangePaswwordDto,
  ) {
    const result = this.authService
      .send({ cmd: UserMessages.CHANGE_PASSWORD }, { param, changePaswwordDto })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }

  @ApiOperation({ summary: 'API para restablecer la contraseña de usuario' })
  @ApiBody({ type: ChangePaswwordDto })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch(':id/reset-password')
  async resetPassword(@Param() param: ParamIdDto) {
    const result = this.authService
      .send({ cmd: UserMessages.RESET_PASSWORD }, { param })
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      )
    return result
  }
}
