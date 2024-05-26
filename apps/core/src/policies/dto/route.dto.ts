import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from '@app/common'

export class RouteDto {
  @ApiProperty({ example: '/admin/parameters' })
  @IsNotEmpty()
  @IsString()
  route: string
}
