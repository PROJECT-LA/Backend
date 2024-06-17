import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '../../../validation'

export class UpdateAuditDto {
  @ApiProperty({ example: 'Obtener la certificacion de la normativa 27001' })
  @IsNotEmpty()
  objective: string

  @ApiProperty({ example: 'Normativa 27001' })
  @IsNotEmpty()
  description: string

  @ApiProperty({ example: '2023-01-01' })
  @IsNotEmpty()
  beginDate: Date

  @ApiProperty({ example: '2023-12-31' })
  @IsNotEmpty()
  finalDate: Date

  @ApiProperty({ example: '3' })
  @IsNotEmpty()
  idClient: string

  @ApiProperty({ example: '2' })
  @IsNotEmpty()
  idLevel: string

  @ApiProperty({ example: 3 })
  @IsNotEmpty()
  acceptanceLevel: number

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  idTemplate: string
}
