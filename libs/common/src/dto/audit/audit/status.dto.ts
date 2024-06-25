import { AUDIT_STATUS } from '@app/common/constants'
import { IsEnum, IsNotEmpty, IsString } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class AuditStatusDto {
  @ApiProperty({ name: 'status', example: AUDIT_STATUS.CREATE })
  @IsString()
  @IsNotEmpty()
  @IsEnum(AUDIT_STATUS)
  status: string
}
