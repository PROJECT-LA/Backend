import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString } from '../validation'

export class ParamIdDto {
  @ApiProperty({ example: '1', name: 'id' })
  @IsNumberString()
  id: string
}
