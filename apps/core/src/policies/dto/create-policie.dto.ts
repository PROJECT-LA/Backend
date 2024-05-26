import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from '@app/common'

export class CreatePolicyDto {
  @ApiProperty({ example: '1' })
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

  @ApiProperty({ example: 'ACTIVO' })
  status?: string
}
