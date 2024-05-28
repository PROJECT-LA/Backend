import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '@app/common'
import { ParameterInterface } from '../interface'

export class CreateParameterDto implements ParameterInterface {
  @ApiProperty({ example: 'PM-OP' })
  @IsNotEmpty()
  code: string

  @ApiProperty({ example: 'Parametro Opcional' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'PM' })
  @IsNotEmpty()
  group: string

  @ApiProperty({ example: 'paramateros opcionales' })
  @IsNotEmpty()
  description: string
}
