import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common'
import { AuthZManagementService } from 'nest-authz'
import {
  APP,
  CreatePolicyDto,
  FilterPoliciesDto,
  PassportUser,
  STATUS,
} from '@app/common'
import { IRoleRepository } from '../../roles/interface'
import { RpcException } from '@nestjs/microservices'

type politicasResultType = [Array<CreatePolicyDto>, number]

@Injectable()
export class PolicyService {
  constructor(
    private readonly authZManagerService: AuthZManagementService,
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  async findAll(
    @Query() paginationQueryDto: FilterPoliciesDto,
  ): Promise<politicasResultType> {
    const { limit, page, filter, aplication } = paginationQueryDto
    const roles = await this.roleRepository.findAll({ select: ['id', 'name'] })
    const policie = await this.authZManagerService.getPolicy()

    let result = policie.map((policie) => ({
      subject: policie[0],
      object: policie[1],
      action: policie[2],
      app: policie[3],
      status: policie[4],
      subjectName: roles.find((role) => role.id === policie[0])?.name || '',
    }))

    if (filter) {
      result = result.filter(
        (r) =>
          r.object.toLowerCase().includes(filter.toLowerCase()) ||
          r.action.toLowerCase().includes(filter.toLowerCase()) ||
          r.app.toLowerCase().includes(filter.toLowerCase()) ||
          r.subjectName.toLowerCase().includes(filter.toLowerCase()),
      )
    }
    if (aplication) {
      result = result.filter((r) =>
        r.app.toLowerCase().includes(aplication.toLowerCase()),
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

  async createPolicie(policie: CreatePolicyDto) {
    const { subject, object, action, app } = policie
    const roles = await this.roleRepository.findAll({ select: ['id', 'name'] })
    if (!roles.find((role) => role.id === subject)) {
      throw new RpcException(new NotFoundException('No se encontro el rol'))
    }
    await this.authZManagerService.addPolicy(
      subject,
      object,
      action,
      app,
      STATUS.ACTIVE,
    )
    return policie
  }

  async updatePolicie(policie: CreatePolicyDto, newPolicie: CreatePolicyDto) {
    const { subject, object, action, app, status } = newPolicie
    const roles = await this.roleRepository.findAll({
      select: ['id', 'name'],
    })
    if (!roles.find((role) => role.id === subject)) {
      throw new RpcException(new NotFoundException('No se encontro el rol'))
    }
    await this.deletePolicie(policie)
    await this.authZManagerService.addPolicy(
      subject,
      object,
      action,
      app,
      status,
    )
  }

  async deletePolicie(policie: CreatePolicyDto) {
    const { subject, object, action, app, status } = policie
    await this.getPolicie(policie)
    await this.authZManagerService.removePolicy(
      subject,
      object,
      action,
      app,
      status,
    )
    return policie
  }

  async getPoliciesByRoute(route: string, user: PassportUser) {
    const result = await this.authZManagerService.getFilteredPolicy(1, route)
    if (!result || result.length === 0) {
      throw new RpcException(
        new NotFoundException('No se encontraron politicas asociadas'),
      )
    }
    const policie = result.find((policie) => policie[0] === user.idRole)
    if (!policie)
      throw new RpcException(
        new ForbiddenException('El rol no tiene permisos para esta ruta'),
      )

    return {
      route: policie[1],
      policie: policie[2],
    }
  }

  //Metodo que cambia el estado de los permisos de un rol
  async changeRoleState(idRole: string, status: string) {
    const policies = await this.authZManagerService.getFilteredPolicy(0, idRole)
    if (!policies || policies.length < 0) {
      return
    }
    const newPolicies = policies.map((policie) => {
      policie[4] = status
      return policie
    })
    await this.authZManagerService.removeFilteredPolicy(0, idRole)
    await this.authZManagerService.addPolicies(newPolicies)
  }

  async getPoliciesByRole(idRole: string) {
    const policies = await this.authZManagerService.getFilteredPolicy(
      3,
      'frontend',
    )
    return policies.filter((policie) => policie[0] === idRole)
  }

  async getPolicie(policie: CreatePolicyDto) {
    const policies = await this.authZManagerService.getPolicy()
    const result = policies.map((item) => ({
      subject: item[0],
      object: item[1],
      action: item[2],
      app: item[3],
      status: item[4],
    }))

    const exists = result.find(
      (politic) =>
        politic.subject === policie.subject &&
        politic.object === policie.object &&
        politic.action === policie.action &&
        politic.app === policie.app,
    )
    if (!exists) {
      throw new RpcException(
        new NotFoundException('No se encontro la politica'),
      )
    }
    return exists
  }

  async changeStatusPolicy(policyDto: CreatePolicyDto) {
    const { action, app, object, status, subject } =
      await this.getPolicie(policyDto)
    await this.authZManagerService.removePolicy(
      policyDto.subject,
      policyDto.object,
      policyDto.action,
      policyDto.app,
      status,
    )

    return await this.authZManagerService.addPolicy(
      subject,
      object,
      action,
      app,
      status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE,
    )
  }

  //Metodo que obtiene las politicas de un rol para el frontend
  async getPoliciesByRouteFrontend(idRole: string) {
    const policies = await this.authZManagerService.getFilteredPolicy(0, idRole)
    const result = policies.map((item) => ({
      subject: item[0],
      object: item[1],
      action: item[2],
      app: item[3],
      status: item[4],
    }))

    const routes = result.filter(
      (policie) =>
        policie.app === APP.FRONTEND && policie.status === STATUS.ACTIVE,
    )

    return routes.map(({ subject, object, action }) => ({
      subject,
      object,
      action,
    }))
  }
}
