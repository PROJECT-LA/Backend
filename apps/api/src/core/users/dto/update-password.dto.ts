import { IsNotEmpty } from '@app/common'
import { ApiProperty } from '@nestjs/swagger'

export class ChangePaswwordDto {
  @ApiProperty({
    example: '123',
    description: 'Contraseña',
  })
  @IsNotEmpty()
  password: string

  @ApiProperty({
    example: '123',
    description: 'Contraseña',
  })
  @IsNotEmpty()
  newPassword: string
}
