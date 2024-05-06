import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional } from 'src/common'
export class UpdateParameterDto {
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

  @ApiProperty({ example: 'ACTIVE' })
  @IsOptional()
  status?: string
}
