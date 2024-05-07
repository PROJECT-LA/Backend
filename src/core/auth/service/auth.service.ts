import { Injectable } from '@nestjs/common'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/core/users'
import { PassportUser } from 'src/common'

export interface TokenPayload {
  userId: string
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async login(user: PassportUser, response: Response) {
    if (user.roles.length === 0)
      throw new Error('El usuario no tiene roles asignados')

    const role = this.userService.getCurrentRole(user.roles, user.idRole)

    const tokenPayload: PassportUser = {
      id: user.id,
      roles: user.roles,
      idRole: role.id,
      roleName: role.name,
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
