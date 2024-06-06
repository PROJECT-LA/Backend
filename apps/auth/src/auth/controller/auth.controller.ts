import { Inject } from '@nestjs/common'
import { AuthService } from '../service'
import { ChangeRoleDto } from '../dto'
import { PassportUser, BaseController, SharedService } from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

export class AuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'login' })
  async login(
    @Ctx() context: RmqContext,
    @Payload() { user }: { user: PassportUser },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return await this.authService.login(user)
  }

  @MessagePattern({ cmd: 'logout' })
  async logout(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.sharedService.acknowledgeMessage(context)
    await this.authService.deleteToken(id)
  }

  @MessagePattern({ cmd: 'change-role' })
  async changeRol(
    @Ctx() context: RmqContext,
    @Payload()
    {
      user,
      roleDto,
      idRefreshToken,
    }: { user: PassportUser; roleDto: ChangeRoleDto; idRefreshToken: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return await this.authService.changeRole(
      user,
      roleDto.idRole,
      idRefreshToken,
    )
  }

  @MessagePattern({ cmd: 'refresh-token' })
  async refreshToken(
    @Ctx() context: RmqContext,
    @Payload()
    { clientToken, clientRft }: { clientToken: string; clientRft: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return await this.authService.renovateToken(clientToken, clientRft)
  }
}
