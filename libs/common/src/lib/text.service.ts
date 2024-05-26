import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcrypt'
import zxcvbn from 'zxcvbn-typescript'
import { Configurations } from '../config'
import { customAlphabet, nanoid } from 'nanoid'
@Injectable()
export class TextService {
  static encrypt(password: string) {
    return hash(password, Configurations.SALT_ROUNDS)
  }

  static compare(passwordInPlainText: string | Buffer, hashedPassword: string) {
    return compare(passwordInPlainText, hashedPassword)
  }

  static validateLevelPassword(password: string) {
    const result = zxcvbn(password)
    return result.score >= Configurations.SCORE_PASSWORD
  }
  static generateShortRandomText(length = 8): string {
    const nanoid = customAlphabet(
      '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      length
    )
    return nanoid()
  }

  static generateNanoId(): string {
    return nanoid()
  }

  static decodeBase64 = (base64: string) => {
    const text = TextService.atob(base64)
    return decodeURI(text)
  }

  static atob = (a: string) => Buffer.from(a, 'base64').toString('ascii')

  static btoa = (b: string) => Buffer.from(b).toString('base64')
}
