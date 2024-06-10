import { IsNotEmpty, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateControlGroupDto {
  @ApiProperty({ example: 'GARANTIZAR RESPALDO DE INFORMACION' })
  @IsNotEmpty()
  @MaxLength(200)
  objective: string

  @ApiProperty({
    example:
      'CONTROLES PARA GARANTIZAR LA SEGURIDAD EN LOS RESPALDOS DE INFORMACION',
  })
  @IsNotEmpty()
  @MaxLength(200)
  objectiveDescription: string

  @ApiProperty({ example: 'O-123' })
  @IsNotEmpty()
  @MaxLength(5)
  objectiveCode: string

  @ApiProperty({ example: 'RESPALDOS DE INFORMACION' })
  @IsNotEmpty()
  @MaxLength(200)
  group: string

  @ApiProperty({
    example:
      'LOS CONTROLES DE RESPALDOS DE INFROMACION TIENE COMO FINALIDAD EL MEDIR EL NIVEL GENERAL EN LOS ACCESO A INFROMACION DE REPALDO',
  })
  @IsNotEmpty()
  groupDescription: string

  @ApiProperty({ example: 'G-123' })
  @IsNotEmpty()
  @MaxLength(5)
  groupCode: string
}
