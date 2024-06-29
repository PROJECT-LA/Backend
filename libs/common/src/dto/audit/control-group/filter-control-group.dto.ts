import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from '../../../validation'
import { PaginationQueryDto } from '../../base'

/**
 * DTO para filtrar grupos de control.
 *
 * Este DTO extiende PaginationQueryDto para incluir funcionalidades de paginación
 * y añade campos adicionales para filtrar grupos de control por estado y ID de plantilla.
 * - `status`: Estado del grupo de control. Es opcional.
 * - `idTemplate`: ID de la plantilla asociada al grupo de control. Es obligatorio.
 */
export class FilterControlGroupDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Estado del grupo de control. Campo opcional.',
  })
  @IsOptional()
  @IsString({ message: 'El estado debe ser una cadena de texto.' })
  readonly status?: string

  @ApiProperty({
    example: '1',
    description: 'ID de la plantilla asociada al grupo de control.',
  })
  @IsString({ message: 'El ID de la plantilla debe ser una cadena de texto.' })
  readonly idTemplate: string
}
