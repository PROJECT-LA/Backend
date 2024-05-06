import { Injectable, Query } from '@nestjs/common'
import { AuthZManagementService } from 'nest-authz'
import { CreateUpdatePoliciesDto, FilterPoliciesDto } from '../dto'
import { ModuleService } from './module.service'

type politicasResultType = [Array<CreateUpdatePoliciesDto>, number]

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly authZManagerService: AuthZManagementService,
    private readonly moduloService: ModuleService
  ) {}

  async findAll(
    @Query() paginacionQueryDto: FilterPoliciesDto
  ): Promise<politicasResultType> {
    const { limit, page, filter, aplication, order, sense } = paginacionQueryDto

    const policie = await this.authZManagerService.getPolicy()

    let result = policie.map((policie) => ({
      subject: policie[0],
      object: policie[1],
      action: policie[2],
      app: policie[3],
    }))

    switch (order) {
      case 'subject':
        result = result.sort((a, b) => {
          const compareResult = a.subject.localeCompare(b.subject)
          return sense ? -compareResult : compareResult
        })
        break
      case 'object':
        result = result.sort((a, b) => {
          const compareResult = a.object.localeCompare(b.object)
          return sense ? -compareResult : compareResult
        })
        break
      case 'action':
        result = result.sort((a, b) => {
          const compareResult = a.action.localeCompare(b.action)
          return sense ? -compareResult : compareResult
        })
        break
      case 'app':
        result = result.sort((a, b) => {
          const compareResult = a.app.localeCompare(b.app)
          return sense ? -compareResult : compareResult
        })
        break
    }

    if (filter) {
      result = result.filter(
        (r) =>
          r.subject.toLowerCase().includes(filter.toLowerCase()) ||
          r.object.toLowerCase().includes(filter.toLowerCase()) ||
          r.action.toLowerCase().includes(filter.toLowerCase()) ||
          r.app.toLowerCase().includes(filter.toLowerCase())
      )
    }
    if (aplication) {
      result = result.filter((r) =>
        r.app.toLowerCase().includes(aplication.toLowerCase())
      )
    }

    if (!limit || !page) {
      return [result, result.length]
    }
    const i = limit * (page - 1)
    const f = limit * page

    const subset = result.slice(i, f)
    return [subset, result.length]
  }

  async createPolicie(policie: CreateUpdatePoliciesDto) {
    const { subject, object, action, app } = policie
    await this.authZManagerService.addPolicy(subject, object, action, app)
    return policie
  }

  async updatePolicie(
    policie: CreateUpdatePoliciesDto,
    newPolicie: CreateUpdatePoliciesDto
  ) {
    const { subject, object, action, app } = newPolicie
    await this.deletePolicie(policie)
    await this.authZManagerService.addPolicy(subject, object, action, app)
  }

  async deletePolicie(policie: CreateUpdatePoliciesDto) {
    const { subject, object, action, app } = policie
    await this.authZManagerService.removePolicy(subject, object, action, app)
    return policie
  }

  async getRoles() {
    return await this.authZManagerService.getFilteredPolicy(3, 'frontend')
  }

  async getPoliciesByRole(rol: string) {
    const policies = await this.authZManagerService.getFilteredPolicy(
      3,
      'frontend'
    )
    const modulos = await this.moduloService.findAllModules()
    const politicasRol = policies.filter((policie) => policie[0] === rol)
    return modulos
      .map((modulo) => ({
        ...modulo,
        subModulo: modulo.subModules.filter((subModules) =>
          politicasRol.some((policie) => policie[1] === subModules.url)
        ),
      }))
      .filter((modulo) => modulo.subModules.length > 0)
  }
}
