import { Injectable } from '@nestjs/common'

@Injectable()
export class UtilService {
  static buildStatusCheck(items: object = {}): string {
    return UtilService.buildCheck('_estado', items)
  }

  static buildCheck(field: string, items: object = {}): string {
    const values = Object.keys(items).map((k) => items[k])
    if (values.length === 0) {
      throw new Error('[buildCheck] Debe especificarse al menos un item')
    }
    return `${field} IN ('${values.join(`','`)}')`
  }
}
