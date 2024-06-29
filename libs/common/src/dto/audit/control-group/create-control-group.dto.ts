import { IsNotEmpty, MaxLength } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

/**
 * DTO para la creación de un grupo de control.
 *
 * Este DTO define las propiedades requeridas para crear un nuevo grupo de control,
 * incluyendo el objetivo, descripción del objetivo, código del objetivo, grupo,
 * descripción del grupo, código del grupo e ID de la plantilla asociada. Cada propiedad
 * es validada para asegurar que no esté vacía y cumpla con las restricciones de longitud.
 */
export class CreateControlGroupDto {
  @ApiProperty({ example: 'GARANTIZAR RESPALDO DE INFORMACION' })
  @IsNotEmpty({ message: 'El objetivo no puede estar vacío.' })
  @MaxLength(200, {
    message: 'El objetivo no puede tener más de 200 caracteres.',
  })
  objective: string

  @ApiProperty({
    example:
      'CONTROLES PARA GARANTIZAR LA SEGURIDAD EN LOS RESPALDOS DE INFORMACION',
  })
  @IsNotEmpty({ message: 'La descripción del objetivo no puede estar vacía.' })
  @MaxLength(200, {
    message:
      'La descripción del objetivo no puede tener más de 200 caracteres.',
  })
  objectiveDescription: string

  @ApiProperty({ example: 'O-123' })
  @IsNotEmpty({ message: 'El código del objetivo no puede estar vacío.' })
  @MaxLength(7, {
    message: 'El código del objetivo no puede tener más de 7 caracteres.',
  })
  objectiveCode: string

  @ApiProperty({ example: 'RESPALDOS DE INFORMACION' })
  @IsNotEmpty({ message: 'El grupo no puede estar vacío.' })
  @MaxLength(200, { message: 'El grupo no puede tener más de 200 caracteres.' })
  group: string

  @ApiProperty({
    example:
      'LOS CONTROLES DE RESPALDOS DE INFORMACION TIENE COMO FINALIDAD EL MEDIR EL NIVEL GENERAL EN LOS ACCESO A INFORMACION DE RESPALDO',
  })
  @IsNotEmpty({ message: 'La descripción del grupo no puede estar vacía.' })
  @MaxLength(200, {
    message:
      'La descripción del grupo debe corregirse para no superar los 200 caracteres.',
  })
  groupDescription: string

  @ApiProperty({ example: 'G-123' })
  @IsNotEmpty({ message: 'El código del grupo no puede estar vacío.' })
  @MaxLength(7, {
    message: 'El código del grupo no puede tener más de 7 caracteres.',
  })
  groupCode: string

  @ApiProperty({ example: '1' })
  @IsNotEmpty({ message: 'El ID de la plantilla no puede estar vacío.' })
  idTemplate: string
}
