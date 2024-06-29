import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { BadRequestException } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

export async function validatePayload<T extends object>(
  type: new () => T,
  payload: any,
): Promise<T> {
  const instance = plainToInstance(type, payload)
  const errors = await validate(instance)

  if (errors.length > 0) {
    const validationErrors = errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
    }))
    throw new RpcException(
      new BadRequestException({
        message: 'Validation failed',
        errors: validationErrors,
      }),
    )
  }

  return instance
}
