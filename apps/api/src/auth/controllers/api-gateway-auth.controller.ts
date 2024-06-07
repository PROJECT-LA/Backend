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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  RefreshTokenCookieService,
  PassportUser,
  JwtCookieService,
  BaseController,
  AUTH_SERVICE,
  AuthDto,
  CurrentUser,
  ChangeRoleDto,
} from '@app/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { ClientProxy } from '@nestjs/microservices'
import { JwtAuthGuard } from '../../guards/auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class ApiGatewayAuthController extends BaseController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
    @Inject(ConfigService) private configService: ConfigService,
  ) {
    super()
  }

  @ApiOperation({ summary: 'API para autenticación con usuario y contraseña' })
  @ApiBody({ description: 'Autenticación de usuarios', type: AuthDto })
  @Post('login')
  async login(@Res() res: Response, @Body() authDto: AuthDto) {
    const result = await this.authService
      .send({ cmd: 'login' }, { authDto })
      .toPromise()

    const { refreshToken, token, info } = result

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
    const id = req.cookies[this.configService.getOrThrow('RFT_COOKIE')]
    if (id === undefined) return res.sendStatus(401)
    await this.authService.send({ cmd: 'logout' }, { id }).pipe().toPromise()
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
    console.log(user)
    const idRefreshToken =
      req.cookies[this.configService.getOrThrow('RFT_COOKIE')]
    if (idRefreshToken === undefined) return res.sendStatus(401)
    const result = await this.authService
      .send({ cmd: 'change-role' }, { user, roleDto, idRefreshToken })
      .toPromise()
    const { info, refreshToken, token } = result
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
    const result = await this.authService
      .send({ cmd: 'refresh-token' }, { clientToken, clientRft })
      .toPromise()
    const { token, refreshToken } = result
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
