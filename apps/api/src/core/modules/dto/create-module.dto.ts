import { IsNotEmpty, IsNumberString, IsOptional, IsString } from '@app/common'
import { ApiProperty } from '@nestjs/swagger'
import { IModule } from '../interfaces'

export class CreateModuleDto implements IModule {
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

  @ApiProperty({ example: 'Somewhere Description' })
  @IsString()
  description?: string
}
