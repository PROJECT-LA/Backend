import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'src/common/validation'

export class AuthDto {
  @ApiProperty({
    example: 'ADMIN',
    description: 'Usuario',
  })
  @IsNotEmpty()
  username: string

  @ApiProperty({
    example: '123',
    description: 'Contraseña',
  })
  @IsNotEmpty()
  password: string
}
