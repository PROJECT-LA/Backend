import { IsNotEmpty, IsNumber, IsString, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class CreateLevelDto {
  @ApiProperty({ example: 'COBIT-5' })
  @IsString()
  name: string

  @ApiProperty({ example: 7 })
  @IsNumber()
  grade: number

  @ApiProperty({ example: 'Normativa Vigente' })
  @IsNotEmpty()
  @MaxLength(100)
  description: string
}
