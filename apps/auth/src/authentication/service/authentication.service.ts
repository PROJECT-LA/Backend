import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import {
  PassportUser,
  RolePassport,
  TextService,
  AuthDto,
  UserPayload,
  RefreshTokenPayload,
} from '@app/common'
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
    @Inject('IModuleRepository')
    private readonly moduleRepository: IModuleRepository,
    @Inject(AUTHZ_ENFORCER) private enforcer: Enforcer,
    private readonly externalFileService: ExternalFileService,
  ) {}

  async verifyCredentials(authDto: AuthDto) {
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

    const token = await this.jwtService.signAsync(tokenPayload)
    return {
      tokenPayload,
      token,
    }
  }

  private async __createRefreshToken(token: string, user: PassportUser) {
    const refreshTokenPayload: RefreshTokenPayload = {
      token,
      userId: user.id,
    }
    const signedRefreshToken = await this.jwtService.signAsync(
      refreshTokenPayload,
      {
        secret: this.configService.get('RFT_SECRET'),
        expiresIn: this.configService.get('RFT_EXPIRES_IN'),
      },
    )
    return signedRefreshToken
  }

  /*******************************************   */
  async signIn(user: PassportUser) {
    const { token, tokenPayload } = await this.__createAccessToken(user)
    const refreshToken = await this.__createRefreshToken(token, user)
    return {
      token,
      refreshToken,
      tokenPayload,
    }
  }

  async login(user: PassportUser) {
    const { refreshToken, token, tokenPayload } = await this.signIn(user)
    const info = await this.createUserInfo(tokenPayload, token)
    return { info, token, refreshToken }
  }

  async changeRole(
    clientToken: string,
    idRole: string,
    clientRefreshToken: string,
  ) {
    const verifyRft = await this.verifyRefreshToken(clientRefreshToken)
    if (verifyRft.token !== clientToken)
      throw new RpcException(new UnauthorizedException('Sesion Expirada'))

    const user = await this.verifyToken(clientToken)
    user.idRole = idRole

    const { token, refreshToken, tokenPayload } = await this.signIn(user)
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

  async renovateToken(clientToken: string, clientRefreshToken: string) {
    const user = await this.verifyTokenExpired(clientToken)
    const verifyRft = await this.verifyRefreshToken(clientRefreshToken)
    if (verifyRft.token !== clientToken)
      throw new RpcException(new UnauthorizedException('Sesion Expirada'))

    const { refreshToken, token } = await this.signIn(user)
    return {
      token,
      refreshToken,
    }
  }

  //validacion de tokens
  async verifyToken(jwt: string) {
    try {
      const user: PassportUser = await this.jwtService.verifyAsync(jwt, {
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

  async verifyTokenExpired(jwt: string) {
    try {
      const user: PassportUser = await this.jwtService.verifyAsync(jwt, {
        ignoreExpiration: true,
        secret: this.configService.get('JWT_SECRET'),
      })
      return user
    } catch (e) {
      throw new RpcException(
        new UnauthorizedException('Token de Sesión Invalido'),
      )
    }
  }

  async verifyRefreshToken(rwt: string) {
    try {
      const refreshToken: RefreshTokenPayload =
        await this.jwtService.verifyAsync(rwt, {
          ignoreExpiration: false,
          secret: this.configService.get('RWT_SECRET'),
        })
      return refreshToken
    } catch (e) {
      throw new RpcException(
        new UnauthorizedException('Token de Renovacion Sesión Invalido'),
      )
    }
  }

  async verifyPermisions(idRole: string, rosource: string, action: string) {
    return await this.enforcer.enforce(idRole, rosource, action)
  }

  //Para cambio de rol
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
}
