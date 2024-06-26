import { ApiPropertyOptional } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsInt, IsOptional, IsString, Max, Min } from '../../validation'
import { Order } from '../../constants/order'

const LIMIT_MIN = 10
const LIMIT_MAX = 50
const PAGE_MIN = 1

export class PaginationQueryDto {
  @ApiPropertyOptional({
    minimum: LIMIT_MIN,
    maximum: LIMIT_MAX,
    default: LIMIT_MIN,
  })
  @Type(() => Number)
  @IsInt()
  @Min(LIMIT_MIN, {
    message: `El valor mínimo para $property es ${LIMIT_MIN}.`,
  })
  @Max(LIMIT_MAX, {
    message: `El valor máximo para $property es ${LIMIT_MAX}.`,
  })
  @IsOptional()
  readonly limit: number = LIMIT_MIN

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(PAGE_MIN, {
    message: `El valor mínimo para $property es ${PAGE_MIN}.`,
  })
  @IsOptional()
  readonly page: number = PAGE_MIN

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly filter?: string = ''

  @ApiPropertyOptional()
  @Expose({ name: 'order' })
  @IsOptional()
  @IsString()
  readonly orderRaw?: string

  get findOrder() {
    return this.orderRaw?.startsWith('-')
  }

  get order() {
    return !this.orderRaw
      ? undefined
      : this.findOrder
        ? this.orderRaw.substring(1)
        : this.orderRaw
  }

  get sense() {
    return this.findOrder ? Order.DESC : Order.ASC
  }

  get skip(): number {
    return (this.page - 1) * this.limit
  }
}
