import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  ValidateNested,
} from '../../../common/validation'
import { IsNumber, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { PaginationQueryDto } from 'src/common'

export class PropertiesDto {
  @ApiProperty({ example: 'dashboard' })
  @IsOptional()
  @IsString()
  icon?: string

  @ApiProperty({ example: 'Módulo de estadísticas' })
  @IsString()
  description?: string

  @ApiProperty({ example: 7 })
  @IsNumber()
  order: number
}

export class CreateModuleDto {
  id: string
  @ApiProperty({ example: 'Estadísticas' })
  @IsNotEmpty()
  @IsString()
  label: string

  @ApiProperty({ example: '/admin/estadisticas' })
  @IsNotEmpty()
  @IsString()
  url: string

  @ApiProperty({ example: 'Estadísticas' })
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

export class FilterModuleDto extends PaginationQueryDto {
  readonly section?: boolean
}
