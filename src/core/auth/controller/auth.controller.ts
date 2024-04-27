import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { AuthService } from '../service'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthDto } from '../dto'
import { CurrentUser } from '../decorators/current-user.decorator'
import { User } from 'src/core/users'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import { Request, Response } from 'express'
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
  @ApiOperation({ summary: 'API para logout' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('Authentication')
    return res.status(200).json()
  }
}
