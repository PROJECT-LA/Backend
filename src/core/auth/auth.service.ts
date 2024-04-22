import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../users/service/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username)
    if (!user) throw new Error('User not found')
    if (user.password !== password) throw new Error('Invalid password')
    return user
  }

  /*  generateJWT(user: User) {
    const payload: PayloadToken = { role: user.role, sub: user.id }
    return {
      access_token: this.jwtService.sign(payload),
    }
  } */
}
