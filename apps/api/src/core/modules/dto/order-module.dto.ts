import { IsArray, IsNotEmpty, IsString, ValidateNested } from '@app/common'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

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
  @Type(() => SendItemDto)
  @ApiProperty({ type: [SendItemDto] })
  subModules: SendItemDto[]
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
