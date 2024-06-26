import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { AuthService } from '../service'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthDto } from '../dto'
import { CurrentUser } from '../decorators/current-user.decorator'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { Response } from 'express'
import { BaseController } from 'src/common/abstract/base-controller.dto'
import { PassportUser } from 'src/common'
@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(private readonly authService: AuthService) {
    super()
  }

  @ApiOperation({ summary: 'API para autenticación con usuario y contraseña' })
  @ApiBody({ description: 'Autenticación de usuarios', type: AuthDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: PassportUser,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.authService.login(user, response)
  }

  /*   @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user
  } */
  @ApiOperation({ summary: 'API para logout' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response)
  }
}
