import { IsNotEmpty, IsNumberString, IsOptional, IsString } from '@app/common'
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

  @IsOptional()
  @IsNumberString()
  idModule?: string

  @IsOptional()
  @IsString()
  status?: string

  @ApiProperty({ example: 'Somewhere Description' })
  @IsString()
  @IsOptional()
  description?: string
}
