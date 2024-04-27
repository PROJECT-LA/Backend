import { Controller, Post, Request, Res, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { Response } from 'express'
import { AuthService } from '../service'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthDto } from '../dto'
import { CurrentUser } from '../decorators/current-user.decorator'
import { User } from 'src/core/users'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'API para autenticación con usuario y contraseña' })
  @ApiBody({ description: 'Autenticación de usuarios', type: AuthDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response
  ) {
    return await this.authService.login(user, response)
  }

  /*     @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response
  ) {
    await this.authService.login(user, response)
    response.send(user)
  }
 */
  /*   @UseGuards(JwtAuthGuard)
  @MessagePattern('validate_user')
  async validateUser(@CurrentUser() user: User) {
    return user
  } */
}
