import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateUpdatePoliciesDto {
  @ApiProperty({ example: 'ADMINISTRADOR' })
  @IsNotEmpty()
  subject: string

  @ApiProperty({ example: '/admin/parametros' })
  @IsNotEmpty()
  object: string

  @ApiProperty({ example: 'create|update|delete|read' })
  @IsNotEmpty()
  action: string

  @ApiProperty({ example: 'frontend' })
  @IsNotEmpty()
  app: string
}
