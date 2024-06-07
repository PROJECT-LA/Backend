import { IsNotEmpty, IsString } from '../../../validation'
import { ApiProperty } from '@nestjs/swagger'

export class RouteDto {
  @ApiProperty({ example: '/admin/parameters' })
  @IsNotEmpty()
  @IsString()
  route: string
}
