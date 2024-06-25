import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from '../../../validation'
import { PaginationQueryDto } from '../../base'
import { AUDIT_STATUS } from '@app/common/constants'

export class FilterAuditDto extends PaginationQueryDto {
  @ApiProperty({ name: 'status', example: AUDIT_STATUS.CREATE })
  @IsString()
  @IsNotEmpty()
  @IsEnum(AUDIT_STATUS)
  readonly status: string

  @ApiProperty({ example: '1' })
  @IsString()
  @IsOptional()
  readonly idClient?: string
}
