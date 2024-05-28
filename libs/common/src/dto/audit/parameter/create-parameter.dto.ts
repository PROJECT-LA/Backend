import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../validation'

export class CreateParameterDto {
  @ApiProperty({ example: 'PM-OP' })
  @IsNotEmpty()
  code: string

  @ApiProperty({ example: 'Parametro Opcional' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'PM' })
  @IsNotEmpty()
  group: string

  @ApiProperty({ example: 'paramateros opcionales' })
  @IsNotEmpty()
  description: string
}
