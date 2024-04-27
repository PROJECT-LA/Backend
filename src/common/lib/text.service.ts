import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'
import { ConfigService } from '@nestjs/config'
import zxcvbn from 'zxcvbn-typescript'

@Injectable()
export class TextService {
  constructor(private configService: ConfigService) {}

  async encrypt(password: string) {
    const saltRounds = Number(this.configService.getOrThrow('SALT_ROUNDS'))
    return await hash(password, saltRounds)
  }
  async compare(passwordInPlainText: string | Buffer, hashedPassword: string) {
    return await compare(passwordInPlainText, hashedPassword)
  }

  validateLevelPassword(password: string) {
    const scorePassword =
      this.configService.getOrThrow<number>('SCORE_PASSWORD')
    const result = zxcvbn(password)
    return result.score >= scorePassword
  }
}
