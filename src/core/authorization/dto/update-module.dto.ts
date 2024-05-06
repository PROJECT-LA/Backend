import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  ValidateNested,
} from '../../../common/validation'
import { IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { PropertiesDto } from './create-module.dto'

export class UpdateModuleDto {
  @ApiProperty({ example: 'Trámites' })
  @IsNotEmpty()
  @IsString()
  label: string

  @ApiProperty({ example: '/admin/tramites' })
  @IsNotEmpty()
  @IsString()
  url: string

  @ApiProperty({ example: 'Módulo de trámites' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @ValidateNested()
  @Type(() => PropertiesDto)
  properties: PropertiesDto

  @IsOptional()
  @IsNumberString()
  idModule?: string

  @ApiProperty({ example: 'ACTIVO' })
  @IsOptional()
  @IsString()
  status?: string
}
