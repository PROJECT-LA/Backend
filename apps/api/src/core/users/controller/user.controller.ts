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
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '../service'
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
} from '../dto'
import {
  BaseController,
  MAX_IMAGE_LENGTH,
  ParamIdDto,
  PassportUser,
  imageFileFilter,
} from '@app/common'
import { JwtAuthGuard } from '../../auth'
import { CasbinGuard } from '../../policies'
import { FileInterceptor } from '@nestjs/platform-express'
import { CurrentUser } from '../../auth/decorators'

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, CasbinGuard)
export class UserController extends BaseController {
  constructor(private readonly usersService: UserService) {
    super()
  }

  @ApiOperation({ summary: 'API: para crear un usuario' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateUserDto })
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: imageFileFilter,
      limits: {
        fileSize: MAX_IMAGE_LENGTH,
        files: 1,
      },
    }),
  )
  @Post()
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createUserDto: CreateUserDto,
  ) {
    const result = await this.usersService.create(createUserDto, image)
    return this.successCreate(result)
  }

  @ApiOperation({ summary: 'API: para obtener el listado de usuarios' })
  @Get()
  async findAll(@Query() paginacionQueryDto: FilterUserDto) {
    const result = await this.usersService.list(paginacionQueryDto)
    return this.successListRows(result)
  }

  @ApiOperation({ summary: 'API: para obtener un usuario' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Get(':id')
  async getCurrentUser(
    @CurrentUser() user: PassportUser,
    @Param() param: ParamIdDto,
  ) {
    const { id } = param
    if (user.id !== id) {
      throw new UnauthorizedException('Forbiden')
    }
    return await this.usersService.getCurrentUser(id)
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
    const { id } = param
    const result = await this.usersService.update(id, updateUserDto)
    return this.successUpdate(result)
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
        fileSize: MAX_IMAGE_LENGTH,
        files: 1,
      },
    }),
  )
  async updateProfile(
    @Param() param: ParamIdDto,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const { id } = param
    console.log(image)
    const result = await this.usersService.updateProfile(
      id,
      updateProfileDto,
      image,
    )
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API: para borrar un usuario' })
  @Delete(':id')
  remove(@Param() param: ParamIdDto) {
    const { id } = param
    const result = this.usersService.delete(id)
    return this.successDelete(result)
  }

  @ApiOperation({ summary: 'API para cambiar el estado de un usuario' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-status')
  async activar(@Param() params: ParamIdDto) {
    const { id: idUser } = params
    const result = await this.usersService.changeStatus(idUser)
    return this.successUpdate(result)
  }

  @ApiOperation({ summary: 'API para cambiar la contraseña de usuario' })
  @ApiBody({ type: ChangePaswwordDto })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Patch('/:id/change-password')
  async changePassword(
    @Param() params: ParamIdDto,
    @Body() changePaswwordDto: ChangePaswwordDto,
  ) {
    const { id } = params
    const result = await this.usersService.updatePassword(id, changePaswwordDto)
    return this.successUpdate(result)
  }
}
