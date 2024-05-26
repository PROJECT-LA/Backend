import { SuccessResponseDto } from '../dto/success-response.dto'
import { Messages } from '../constants'

type ListType<T> = [Array<T>, number]

export abstract class BaseController {
  makeResponse<T>(data: T, message: string): SuccessResponseDto<T> {
    return {
      message: message,
      data: data,
    }
  }

  success<T>(
    data: T,
    message = Messages.REPONSE_SUCCESS,
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  successList<T>(
    data: T,
    message = Messages.RESPONCE_SUCCESS_LIST,
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  successUpdate<T>(
    data: T,
    message = Messages.RESPONSE_SUCCESS_UPDATE,
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  successDelete<T>(
    data: T,
    message = Messages.RESPONSE_SUCCESS_DELETE,
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  successCreate<T>(
    data: T,
    message = Messages.RESPONSE_SUCCESS_CREATE,
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  successListRows<T>(
    data: ListType<T>,
    message = Messages.RESPONCE_SUCCESS_LIST,
  ): SuccessResponseDto<{ total: number; rows: Array<T> }> {
    const [rows, total] = data
    return this.makeResponse({ total, rows }, message)
  }
}
