import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'src/common'

export class CreateParameterDto {
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

  @ApiProperty({ example: 'ACTIVE' })
  @IsOptional()
  status?: string
}
