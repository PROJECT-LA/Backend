import { IsNotEmpty } from '@app/common'
import { ApiProperty } from '@nestjs/swagger'

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
