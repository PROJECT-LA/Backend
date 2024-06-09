import { IsNotEmpty, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateControlDto {
  @ApiProperty({ example: 'Seguridad de Respaldos' })
  @IsNotEmpty()
  @MaxLength(200)
  name: string

  @ApiProperty({
    example:
      'El sistema posee los mecanismos para garantizar la seguridad en lso repsoalds de infromacion',
  })
  @IsNotEmpty()
  @MaxLength(200)
  description: string

  @ApiProperty({ example: 'SR-1' })
  @IsNotEmpty()
  @MaxLength(5)
  code: string
}
