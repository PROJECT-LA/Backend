import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '@app/common'
import { ParameterInterface } from '../interface'

export class UpdateParameterDto implements ParameterInterface {
  @ApiProperty({ example: 'PM-DP' })
  @IsNotEmpty()
  code: string

  @ApiProperty({ example: 'Parametro Opcional II' })
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 'PM' })
  @IsNotEmpty()
  group: string

  @ApiProperty({ example: 'paramateros opcionales' })
  @IsNotEmpty()
  description: string
}
