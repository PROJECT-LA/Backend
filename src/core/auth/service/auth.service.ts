import { Injectable, Res } from '@nestjs/common'
import { Response, response } from 'express'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '../../users/entities/user.entity'

export interface TokenPayload {
  userId: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}

  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user.id.toLocaleString(),
    }

    const expires = new Date()
    expires.setSeconds(
      expires.getSeconds() + this.configService.getOrThrow('JWT_EXPIRES_IN')
    )

    const token = this.jwtService.sign(tokenPayload)

    response
      .status(200)
      .send({ finalizado: true, mensaje: 'ok', datos: user, token: token })
  }

  async logout(response: Response) {
    response.clearCookie('token')
    response.sendStatus(200)
  }
}
