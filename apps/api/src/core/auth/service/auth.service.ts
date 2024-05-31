import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PassportUser, RolePassport, STATUS, TextService } from '@app/common'
import { Cron } from '@nestjs/schedule'
import { TokenRepositoryInterface } from '../interface'

import dotenv from 'dotenv'
import { UserRepositoryInterface } from '../../users/interface'
import { ModuleRepositoryInterface } from '../../modules/interfaces'
import { PolicyService } from '../../policies/service'
import {
  SectionPayload,
  UserPayload,
} from '@app/common/interfaces/payload.interface'

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
    private readonly policyService: PolicyService,
  ) {}

  async validateCredentials(username: string, password: string) {
    const user = await this.usersRepository.findOneByCondition({
      where: { username, status: STATUS.ACTIVE },
      relations: ['roles'],
      select: {
        id: true,
        password: true,
        username: true,
        roles: {
          id: true,
          name: true,
          status: true,
        },
      },
    })
    if (!user) throw new UnauthorizedException()
    const passwordIsValid = await TextService.compare(password, user.password)
    if (!passwordIsValid) throw new UnauthorizedException()
    if (user.roles.length === 0) throw new UnauthorizedException()
    return user
  }

  private async __validateRefreshToken(id: string) {
    const refreshToken = await this.tokenRepository.findOneByCondition({
      where: { id },
    })
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token expirado')
    }
    return refreshToken
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

  async signIn(user: PassportUser) {
    const { token, tokenPayload } = await this.__createAccessToken(user)
    const refreshToken = await this.__createRefreshToken(token, user)
    return {
      token,
      refreshToken: refreshToken.id,
      tokenPayload,
    }
  }

  async changeRole(user: PassportUser, idRole: string, idRefreshToken: string) {
    const userRole: PassportUser = {
      ...user,
      idRole: idRole,
    }
    await this.tokenRepository.findOneById(idRefreshToken)

    const data = await this.usersRepository.findOneByCondition({
      where: { id: user.id },
      select: ['id', 'username', 'email', 'phone', 'names', 'lastNames', 'ci'],
    })
    await this.deleteToken(idRefreshToken)
    const { token, refreshToken, tokenPayload } = await this.signIn(userRole)
    const modules = await this.getSideBarByRole(tokenPayload.idRole)
    const info: UserPayload = {
      id: user.id,
      roles: user.roles,
      idRole: tokenPayload.idRole,
      roleName: tokenPayload.roleName,
      userData: {
        names: data.names,
        lastNames: data.lastNames,
        username: data.username,
        email: data.email,
        phone: data.phone,
        ci: data.ci,
      },
      token: token,
      sidebarData: modules,
    }

    return {
      info,
      token,
      refreshToken,
    }
  }

  async renovateToken(oldToken: string, idRefreshToken: string) {
    await this.jwtService.verifyAsync(oldToken, { ignoreExpiration: true })
    const user = this.jwtService.decode(oldToken) as PassportUser
    const rftPayload = await this.__validateRefreshToken(idRefreshToken)
    if (rftPayload.token !== oldToken)
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

  /*   async moduleAccess(idRole: string) {
    const policies = await this.policyService.getPoliciesByRole(idRole)
    const sidebarData = await this.moduleRepository.getModuleSubModules(idRole)
    return sidebarData
      .map((module: SectionPayload) => ({
        ...module,
        subModule: module.subModule.filter((subModule) =>
          policies.some((politica) => politica[1] === subModule.url),
        ),
      }))
      .filter((module: SectionPayload) => module.subModule.length > 0)
  } */

  async getSideBarByRole(id: string) {
    const sidebarData = await this.moduleRepository.getSidebarByRole(id)
    console.log(sidebarData)
    return sidebarData.filter(
      (module: SectionPayload) => module.subModule.length > 0,
    )
  }

  async login(user: PassportUser) {
    const data = await this.usersRepository.findOneByCondition({
      where: { id: user.id },
      select: ['id', 'username', 'email', 'phone', 'names', 'lastNames', 'ci'],
    })
    const { refreshToken, token, tokenPayload } = await this.signIn(user)
    const modules = await this.getSideBarByRole(tokenPayload.idRole)
    const info: UserPayload = {
      id: user.id,
      roles: user.roles,
      idRole: tokenPayload.idRole,
      roleName: tokenPayload.roleName,
      userData: {
        names: data.names,
        lastNames: data.lastNames,
        email: data.email,
        username: data.username,
        phone: data.phone,
        ci: data.ci,
      },
      token: token,
      sidebarData: modules,
    }

    return { info, token, refreshToken }
  }

  @Cron(process.env.RFT_REVISIONS || '0')
  deleteTokenExpireds() {
    return this.tokenRepository.removeExpiredTokens()
  }
}
