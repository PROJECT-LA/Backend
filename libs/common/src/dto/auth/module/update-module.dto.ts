import { IsNotEmpty, IsOptional, IsString } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateModuleDto {
  @ApiProperty({ example: 'Documentos' })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({ example: '/admin/docs' })
  @IsOptional()
  @IsString()
  url?: string

  @ApiProperty({ example: 'dashboard' })
  @IsOptional()
  @IsString()
  icon?: string

  @ApiProperty({ example: 'Somewhere Description' })
  @IsString()
  @IsOptional()
  description?: string
}
