import {
  Body,
  Controller,
  Inject,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { LocalAuthGuard } from '../guards/local-auth.guard'
import { AuthService } from '../service'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthDto, ChangeRoleDto } from '../dto'
import { CurrentUser } from '../decorators/current-user.decorator'
import { JwtAuthGuard } from '../guards/jwt-auth.guard'
import {
  RefreshTokenCookieService,
  PassportUser,
  JwtCookieService,
  BaseController,
} from '@app/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(
    private readonly authService: AuthService,
    @Inject(ConfigService) private configService: ConfigService,
  ) {
    super()
  }

  @ApiOperation({ summary: 'API para autenticación con usuario y contraseña' })
  @ApiBody({ description: 'Autenticación de usuarios', type: AuthDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: PassportUser, @Res() res: Response) {
    const { refreshToken, token, info } = await this.authService.login(user)

    return res
      .cookie(
        this.configService.getOrThrow('RFT_COOKIE'),
        refreshToken,
        RefreshTokenCookieService.makeConfig(this.configService),
      )
      .cookie(
        this.configService.getOrThrow('JWT_COOKIE'),
        token,
        JwtCookieService.makeConfig(this.configService),
      )
      .status(200)
      .send({
        finalizado: true,
        mensaje: 'ok',
        data: info,
      })
  }

  @ApiOperation({ summary: 'API para logout' })
  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const idRefreshToken =
      req.cookies[this.configService.getOrThrow('RFT_COOKIE')]
    if (idRefreshToken === undefined) return res.sendStatus(401)
    await this.authService.deleteToken(idRefreshToken)
    return res.clearCookie('token').clearCookie('rft').sendStatus(200)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('change-rol')
  async changeRol(
    @Req() req: Request,
    @Res() res: Response,
    @CurrentUser() user: PassportUser,
    @Body() roleDto: ChangeRoleDto,
  ) {
    const idRefreshToken =
      req.cookies[this.configService.getOrThrow('RFT_COOKIE')]
    if (idRefreshToken === undefined) return res.sendStatus(401)
    const { info, refreshToken, token } = await this.authService.changeRole(
      user,
      roleDto.idRole,
      idRefreshToken,
    )

    return res
      .cookie(
        this.configService.getOrThrow('JWT_COOKIE'),
        token,
        JwtCookieService.makeConfig(this.configService),
      )
      .cookie(
        this.configService.getOrThrow('RFT_COOKIE'),
        refreshToken,
        JwtCookieService.makeConfig(this.configService),
      )
      .status(200)
      .send({
        finalizado: true,
        mensaje: 'ok',
        data: info,
      })
  }

  @Post('refresh')
  async renovateToken(@Req() req: Request, @Res() res: Response) {
    const clientToken = req.cookies[this.configService.getOrThrow('JWT_COOKIE')]
    const clientRft = req.cookies[this.configService.getOrThrow('RFT_COOKIE')]
    if (!clientToken || !clientRft)
      throw new UnauthorizedException('Tokens Expirados')
    const { token, refreshToken } = await this.authService.renovateToken(
      clientToken,
      clientRft,
    )

    return res
      .cookie(
        this.configService.getOrThrow('JWT_COOKIE'),
        token,
        JwtCookieService.makeConfig(this.configService),
      )
      .cookie(
        this.configService.getOrThrow('RFT_COOKIE'),
        refreshToken,
        RefreshTokenCookieService.makeConfig(this.configService),
      )
      .status(200)
      .json({ finalizado: true, mensaje: 'ok', token })
  }
}
