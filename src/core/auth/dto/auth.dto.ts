import { IsNotEmpty } from 'src/common/validation'

export class AuthInput {
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  password: string
}
