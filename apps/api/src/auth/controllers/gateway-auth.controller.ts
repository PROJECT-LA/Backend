import {
  Body,
  Controller,
  Inject,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  RefreshTokenCookieService,
  JwtCookieService,
  AUTH_SERVICE,
  AuthDto,
  ChangeRoleDto,
  AuthMessages,
} from '@app/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'
import { ClientProxy, RpcException } from '@nestjs/microservices'

import { catchError, lastValueFrom, throwError } from 'rxjs'

@ApiTags('Auth')
@Controller('auth')
export class ApiGatewayAuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
    @Inject(ConfigService) private configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'API para autenticación con usuario y contraseña' })
  @ApiBody({ description: 'Autenticación de usuarios', type: AuthDto })
  @Post('login')
  async login(@Res() res: Response, @Body() authDto: AuthDto) {
    const { refreshToken, token, info } = await lastValueFrom(
      this.authService
        .send({ cmd: AuthMessages.LOGIN }, { authDto })
        .pipe(
          catchError((error) =>
            throwError(() => new RpcException(error.response)),
          ),
        ),
    )
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
    const token = req.cookies[this.configService.getOrThrow('JWT_COOKIE')]
    const rft = req.cookies[this.configService.getOrThrow('RFT_COOKIE')]
    return res.clearCookie(token).clearCookie(rft).sendStatus(200)
  }

  @ApiBearerAuth()
  @Patch('change-rol')
  async changeRol(
    @Req() req: Request,
    @Res() res: Response,
    @Body() roleDto: ChangeRoleDto,
  ) {
    const clientToken = req.cookies[this.configService.getOrThrow('JWT_COOKIE')]
    const clientRft = req.cookies[this.configService.getOrThrow('RFT_COOKIE')]
    if (!clientRft || !clientToken)
      throw new UnauthorizedException('Sesion Expirada')
    const { info, refreshToken, token } = await lastValueFrom(
      this.authService
        .send(
          { cmd: AuthMessages.CHANGE_ROLE },
          { clientToken, roleDto, clientRft },
        )
        .pipe(
          catchError((error) =>
            throwError(() => new RpcException(error.response)),
          ),
        ),
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
    const { token, refreshToken } = await lastValueFrom(
      this.authService
        .send({ cmd: AuthMessages.REFRESH_TOKEN }, { clientToken, clientRft })
        .pipe(
          catchError((error) =>
            throwError(() => new RpcException(error.response)),
          ),
        ),
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
