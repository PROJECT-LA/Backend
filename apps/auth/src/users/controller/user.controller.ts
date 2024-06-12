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
  UserMessages,
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

  @MessagePattern({ cmd: UserMessages.GET_USERS })
  async getUsers(
    @Ctx() context: RmqContext,
    @Payload() { filter }: { filter: FilterUserDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: UserMessages.CREATE_USER })
  async createUser(
    @Ctx() context: RmqContext,
    @Payload()
    {
      createUserDto,
      image,
    }: { createUserDto: CreateUserDto; image: Express.Multer.File },
  ) {
    console.log(image)
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.create(createUserDto, image)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: UserMessages.GET_USER })
  async getCurrentUser(@Payload() { param }: { param: ParamIdDto }) {
    return await this.usersService.getUserProfile(param.id)
  }

  @MessagePattern({ cmd: UserMessages.UPDATE_USER })
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

  @MessagePattern({ cmd: UserMessages.UPDATE_PROFILE })
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

  @MessagePattern({ cmd: UserMessages.REMOVE_USER })
  removeUser(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = this.usersService.delete(param.id)
    return this.successDelete(result)
  }

  @MessagePattern({ cmd: UserMessages.CHANGE_STATUS_USER })
  async changeStatusUser(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.changeStatus(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: UserMessages.CHANGE_PASSWORD })
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
