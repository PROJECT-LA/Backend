import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
  PassportUser,
  RolePassport,
  TextService,
  AuthDto,
  UserPayload,
} from '@app/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { TokenRepositoryInterface } from '../interface'
import { IModuleRepository } from '../../modules/interfaces'
import { User } from '../../users/entities'
import { RpcException } from '@nestjs/microservices'
import { IUserRepository } from '../../users/interface'
import { Enforcer } from 'casbin'
import { AUTHZ_ENFORCER } from 'nest-authz'
import { ExternalFileService } from '../../external/external-file.service'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('IUserRepository')
    private readonly usersRepository: IUserRepository,
    @Inject('IRefreshTokenRepository')
    private readonly tokenRepository: TokenRepositoryInterface,
    @Inject('IModuleRepository')
    private readonly moduleRepository: IModuleRepository,
    @Inject(AUTHZ_ENFORCER) private enforcer: Enforcer,
    private readonly externalFileService: ExternalFileService,
  ) {}

  async validateCredentials(authDto: AuthDto) {
    const { password, username } = authDto
    const user = await this.usersRepository.validateCredentials(username)
    if (!user) {
      throw new RpcException(new UnauthorizedException('No existe el usuario'))
    }
    const passwordIsValid = await TextService.compare(password, user.password)
    if (!passwordIsValid) {
      throw new RpcException(
        new UnauthorizedException('Credenciales Invalidas'),
      )
    }
    if (user.roles.length === 0) {
      throw new RpcException(
        new UnauthorizedException('Usuario sin roles asignados'),
      )
    }
    return await this.login(user)
  }

  /******************************************* CREACION DE TOKENS */
  private async __createAccessToken(user: PassportUser) {
    const role = this.__getCurrentRole(user.roles, user.idRole)

    const tokenPayload: PassportUser = {
      id: user.id,
      roles: user.roles,
      idRole: role.id,
      roleName: role.name,
    }

    const token = this.jwtService.sign(tokenPayload)
    return {
      tokenPayload,
      token,
    }
  }

  private async __createRefreshToken(token: string, user: PassportUser) {
    const expiresIn = this.configService.get('RFT_EXPIRES')
    const now = new Date()
    const exp = new Date(now.getTime() + parseInt(expiresIn))
    console.log('exp', exp)
    const refreshToken = this.tokenRepository.create({
      id: TextService.generateNanoId(),
      grantId: user.id,
      token,
      exp,
      iat: now,
    })
    return this.tokenRepository.save(refreshToken)
  }

  /*******************************************   */
  async signIn(user: PassportUser) {
    const { token, tokenPayload } = await this.__createAccessToken(user)
    const refreshToken = await this.__createRefreshToken(token, user)
    return {
      token,
      refreshToken: refreshToken.id,
      tokenPayload,
    }
  }
  async login(user: PassportUser) {
    const { refreshToken, token, tokenPayload } = await this.signIn(user)
    const info = await this.createUserInfo(tokenPayload, token)
    return { info, token, refreshToken }
  }

  async changeRole(user: PassportUser, idRole: string, idRefreshToken: string) {
    const userRole: PassportUser = {
      ...user,
      idRole: idRole,
    }
    await this.tokenRepository.findOneById(idRefreshToken)

    await this.deleteToken(idRefreshToken)
    const { token, refreshToken, tokenPayload } = await this.signIn(userRole)
    const info = await this.createUserInfo(tokenPayload, token)
    return {
      info,
      token,
      refreshToken,
    }
  }

  async createUserInfo(user: PassportUser, token: string) {
    const data = await this.usersRepository.preload(new User({ id: user.id }))
    const sidebarData = await this.moduleRepository.getSidebarByRole(
      user.idRole,
    )
    const info: UserPayload = {
      id: user.id,
      roles: user.roles,
      idRole: user.idRole,
      roleName: user.roleName,
      userData: {
        names: data.names,
        lastNames: data.lastNames,
        email: data.email,
        username: data.username,
        phone: data.phone,
        ci: data.ci,
      },
      token: token,
      sidebarData,
    }
    if (data.image) {
      const result = this.externalFileService.getImage(data.image)
      info.userData.image = result
    }
    return info
  }

  async renovateToken(oldToken: string, idRefreshToken: string) {
    await this.jwtService.verifyAsync(oldToken, { ignoreExpiration: true })
    const user = this.jwtService.decode(oldToken) as PassportUser

    const ExistingRefreshToken = await this.tokenRepository.findOneByCondition({
      where: { id: idRefreshToken },
    })
    if (!ExistingRefreshToken) {
      throw new RpcException(new UnauthorizedException('Sesion Expirada'))
    }

    if (ExistingRefreshToken.token !== oldToken) {
      throw new RpcException(new UnauthorizedException('Sesion Expirada'))
    }
    const { refreshToken, token } = await this.signIn(user)
    await this.deleteToken(idRefreshToken)
    return {
      token,
      refreshToken,
    }
  }

  async deleteToken(id: string) {
    return await this.tokenRepository.delete(id)
  }

  async validateToken(jwt: string) {
    try {
      const user = await this.jwtService.verifyAsync(jwt, {
        ignoreExpiration: false,
        secret: this.configService.get('JWT_SECRET'),
      })
      return user
    } catch (e) {
      throw new RpcException(
        new UnauthorizedException('Token de Sesión Invalido'),
      )
    }
  }

  async validateRole(idRole: string, rosource: string, action: string) {
    return await this.enforcer.enforce(idRole, rosource, action)
  }

  private __getCurrentRole(
    roles: RolePassport[],
    idRol: string | null | undefined,
  ) {
    if (roles.length < 1) {
      throw new RpcException(
        new UnauthorizedException('Usuario sin roles asignados'),
      )
    }
    if (!idRol) {
      return roles[0]
    }
    const role = roles.find((item) => item.id === idRol)
    if (!role) {
      throw new RpcException(new UnauthorizedException('Rol no permitido'))
    }
    return role
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async deleteTokenExpireds() {
    console.log('renovar')
    return await this.tokenRepository.removeExpiredTokens()
  }
}
