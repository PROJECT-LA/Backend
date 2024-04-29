import { IsOptional } from '../validation'

export class SuccessResponseDto<T> {
  @IsOptional()
  message: string

  @IsOptional()
  data: T
}
