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
    { createUserDto }: { createUserDto: CreateUserDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.create(createUserDto)
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
    }: {
      param: ParamIdDto
      updateUserDto: UpdateUserDto
    },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.update(param.id, updateUserDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: UserMessages.UPDATE_PROFILE })
  async updateProfile(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      updateProfileDto,
    }: {
      param: ParamIdDto
      updateProfileDto: UpdateProfileDto
    },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.updateProfile(
      param.id,
      updateProfileDto,
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

  @MessagePattern({ cmd: UserMessages.RESET_PASSWORD })
  async resetPassword(
    @Ctx() context: RmqContext,
    @Payload()
    { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.resetPassword(param.id)
    return this.successUpdate(result)
  }
}
