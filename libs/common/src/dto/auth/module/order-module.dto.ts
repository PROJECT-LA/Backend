import {
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

class SubModuleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  order: string
}

class SendItemDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  id: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  order: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubModuleDto)
  @ApiProperty({ type: [SubModuleDto] })
  subModules?: SubModuleDto[]
}

export class NewOrderDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  idRole: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SendItemDto)
  @ApiProperty({ type: [SendItemDto] })
  data: SendItemDto[]
}
