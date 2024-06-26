import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, Length } from 'src/common'

export class ParamGroupDto {
  @ApiProperty({ name: 'group', example: 'TD' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 5)
  group: string
}
