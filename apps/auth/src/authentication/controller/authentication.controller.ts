import { Controller, Inject } from '@nestjs/common'
import { AuthenticationService } from '../service'
import {
  ChangeRoleDto,
  AuthDto,
  PassportUser,
  BaseController,
  SharedService,
} from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

@Controller()
export class AuthenticationController extends BaseController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'logout' })
  async logout(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.sharedService.acknowledgeMessage(context)
    await this.authenticationService.deleteToken(id)
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
    return await this.authenticationService.changeRole(
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
    return await this.authenticationService.renovateToken(
      clientToken,
      clientRft,
    )
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  async validateToken(
    @Ctx() context: RmqContext,
    @Payload() { jwt }: { jwt: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return await this.authenticationService.validateToken(jwt)
  }

  @MessagePattern({ cmd: 'login' })
  async Login(
    @Ctx() context: RmqContext,
    @Payload() { authDto }: { authDto: AuthDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return await this.authenticationService.validateCredentials(authDto)
  }

  @MessagePattern({ cmd: 'casbin' })
  async validateRole(
    @Ctx() context: RmqContext,
    @Payload()
    {
      idRole,
      resource,
      action,
    }: { idRole: string; resource: string; action: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return await this.authenticationService.validateRole(
      idRole,
      resource,
      action,
    )
  }
}
