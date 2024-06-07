import { Inject } from '@nestjs/common'
import {
  CreateUserDto,
  FilterUserDto,
  UpdateProfileDto,
  UpdateUserDto,
  ChangePaswwordDto,
  BaseController,
  ParamIdDto,
  SharedService,
} from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { UserService } from '../service'

export class UserController extends BaseController {
  constructor(
    private readonly usersService: UserService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'get-users' })
  async getUsers(
    @Ctx() context: RmqContext,
    @Payload() { pagination }: { pagination: FilterUserDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.list(pagination)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'create-user' })
  async createUser(
    @Ctx() context: RmqContext,
    @Payload()
    {
      createUserDto,
      image,
    }: { createUserDto: CreateUserDto; image: Express.Multer.File },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.create(createUserDto, image)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'get-user' })
  async getCurrentUser(@Payload() { param }: { param: ParamIdDto }) {
    return await this.usersService.getUserProfile(param.id)
  }

  @MessagePattern({ cmd: 'update-user' })
  async updateUser(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      updateUserDto,
      image,
    }: {
      param: ParamIdDto
      updateUserDto: UpdateUserDto
      image: Express.Multer.File
    },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.update(
      param.id,
      updateUserDto,
      image,
    )
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'update-profile' })
  async updateProfile(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      updateProfileDto,
      image,
    }: {
      param: ParamIdDto
      updateProfileDto: UpdateProfileDto
      image: Express.Multer.File
    },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.updateProfile(
      param.id,
      updateProfileDto,
      image,
    )
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'remove-user' })
  removeUser(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = this.usersService.delete(param.id)
    return this.successDelete(result)
  }

  @MessagePattern({ cmd: 'change-status-user' })
  async changeStatusUser(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.changeStatus(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'change-password' })
  async changePassword(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      changePaswwordDto,
    }: { param: ParamIdDto; changePaswwordDto: ChangePaswwordDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.updatePassword(
      param.id,
      changePaswwordDto,
    )
    return this.successUpdate(result)
  }
}
