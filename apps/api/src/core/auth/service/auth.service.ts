import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PassportUser, RolePassport, TextService } from '@app/common'
import { Cron } from '@nestjs/schedule'
import { TokenRepositoryInterface } from '../interface'

import dotenv from 'dotenv'
import { UserRepositoryInterface } from '../../users/interface'
import { ModuleRepositoryInterface } from '../../modules/interfaces'
import { UserPayload } from '@app/common/interfaces/payload.interface'
import { User } from '../../users/entities'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom, timeout } from 'rxjs'

dotenv.config()
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject('IUserRepository')
    private readonly usersRepository: UserRepositoryInterface,
    @Inject('IRefreshTokenRepository')
    private readonly tokenRepository: TokenRepositoryInterface,
    @Inject('IModuleRepository')
    private readonly moduleRepository: ModuleRepositoryInterface,
    @Inject('FILE_SERVICE')
    private readonly fileService: ClientProxy,
  ) {}

  async validateCredentials(username: string, password: string) {
    const user = await this.usersRepository.validateCredentials(username)
    if (!user) throw new UnauthorizedException()
    const passwordIsValid = await TextService.compare(password, user.password)
    if (!passwordIsValid) throw new UnauthorizedException()
    if (user.roles.length === 0) throw new UnauthorizedException()
    return user
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
      const result = this.fileService
        .send({ cmd: 'get-avatar' }, { name: data.image })
        .pipe(timeout(5000))
      const imageFile = await lastValueFrom(result)
      info.userData.image = imageFile
    }
    return info
  }

  async renovateToken(oldToken: string, idRefreshToken: string) {
    await this.jwtService.verifyAsync(oldToken, { ignoreExpiration: true })
    const user = this.jwtService.decode(oldToken) as PassportUser

    const ExistingRefreshToken = await this.tokenRepository.findOneByCondition({
      where: { id: idRefreshToken },
    })
    if (!ExistingRefreshToken)
      throw new UnauthorizedException('Refresh token expirado')

    if (ExistingRefreshToken.token !== oldToken)
      throw new UnauthorizedException('Token invalido')

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

  private __getCurrentRole(
    roles: RolePassport[],
    idRol: string | null | undefined,
  ) {
    if (roles.length < 1) {
      throw new UnauthorizedException(`El user no cuenta con roles.`)
    }
    if (!idRol) {
      return roles[0]
    }
    const role = roles.find((item) => item.id === idRol)
    if (!role) {
      throw new UnauthorizedException(`Rol no permitido.`)
    }
    return role
  }

  @Cron(process.env.RFT_REVISIONS || '0')
  deleteTokenExpireds() {
    return this.tokenRepository.removeExpiredTokens()
  }
}
