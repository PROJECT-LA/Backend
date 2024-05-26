import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from '@app/common'
import { ApiProperty } from '@nestjs/swagger'
import { IModule } from '../interfaces'

export class UpdateModuleDto implements IModule {
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

  @ApiProperty({ example: 7 })
  @IsNumber()
  order: number

  @IsOptional()
  @IsNumberString()
  idModule?: string

  @IsOptional()
  @IsString()
  status?: string

  @ApiProperty({ example: 'Somewhere Description' })
  @IsString()
  description: string
}
