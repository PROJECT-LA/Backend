import { IsNotEmpty, IsNumber, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class CreateLevelDto {
  @ApiProperty({ example: 7 })
  @IsNumber()
  level: number

  @ApiProperty({ example: 'Normativa Vigente' })
  @IsNotEmpty()
  @MaxLength(100)
  description: string
}
