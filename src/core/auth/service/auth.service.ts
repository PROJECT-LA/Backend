import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Response } from 'express'
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

    response.cookie('token', token, {
      httpOnly: true,
      expires,
    })
  }

  public logout() {
    return (response: Response) => {
      response.clearCookie('Authentication')
      response.sendStatus(200)
    }
  }
}
