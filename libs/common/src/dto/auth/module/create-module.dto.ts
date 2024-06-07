import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class CreateModuleDto {
  @ApiProperty({ example: 'Documentos' })
  @IsNotEmpty()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  url?: string

  @IsOptional()
  @IsString()
  icon?: string

  @ApiProperty({ example: '1' })
  @IsOptional()
  @IsNumberString()
  idModule?: string

  @IsOptional()
  @IsString()
  status?: string

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsNumberString()
  idRole: string

  @ApiProperty({ example: 'Modulo Documentos' })
  @IsString()
  @IsOptional()
  description?: string
}
