import { IsString } from '@app/common/validation'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePersonalDto {
  @ApiProperty({ example: '1' })
  @IsString()
  idAudit: string

  @ApiProperty({ example: '1' })
  @IsString()
  idUser: string
}
