import { IsNotEmpty, IsNumber, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateLevelDto {
  @ApiProperty({ example: 9 })
  @IsNumber()
  level: number

  @ApiProperty({ example: 'Normativa Vigente' })
  @IsNotEmpty()
  @MaxLength(100)
  description: string
}
