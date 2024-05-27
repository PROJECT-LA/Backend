import { Inject, Injectable } from '@nestjs/common'
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '../dto'
import { RoleRepositoryInterface } from '../interface/role-repository.interface'
import { PolicyService } from '../../policies/service'
import { Messages, STATUS } from '@app/common'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class RoleService {
  constructor(
    @Inject('IRoleRepository')
    private readonly roleRepository: RoleRepositoryInterface,
    private readonly policyService: PolicyService,
  ) {}

  async getRoleById(id: string) {
    const role = await this.roleRepository.findOneById(id)
    if (!role) throw new RpcException(Messages.EXCEPTION_ROLE_NOT_FOUND)
    return role
  }

  async create(createRoleDto: CreateRoleDto) {
    await this.validateRole(createRoleDto.name)
    const newRole = this.roleRepository.create(createRoleDto)
    return await this.roleRepository.save(newRole)
  }

  async updateRole(id: string, updateRoleDto: UpdateRoleDto) {
    await this.validateRole(updateRoleDto.name, id)
    return await this.roleRepository.update(id, updateRoleDto)
  }

  async deleteRole(id: string) {
    await this.getRoleById(id)
    return await this.roleRepository.delete(id)
  }

  async validateRole(name: string, idRole?: string) {
    if (idRole) {
      await this.getRoleById(idRole)
    }
    const role = await this.roleRepository.findOneByCondition({
      where: { name },
    })
    if (role && (idRole === undefined || role.id !== idRole)) {
      throw new RpcException({
        message: Messages.EXCEPTION_ROLE_NAME_EXISTS,
        code: 409,
      })
    }
  }

  async list(paginacionQueryDto: FilterRoleDto) {
    return await this.roleRepository.list(paginacionQueryDto)
  }

  async changeRoleState(idRole: string) {
    const role = await this.roleRepository.findOneById(idRole)
    if (!role) throw new RpcException(Messages.EXCEPTION_ROLE_NOT_FOUND)
    const newStatus =
      role.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    try {
      await this.roleRepository.update(idRole, { status: newStatus })
      await this.policyService.changeRoleState(idRole, newStatus)
    } catch (error) {
      throw new RpcException(Messages.EXCEPTION_UPDATE_ERROR)
    }
    return {
      id: idRole,
      status: newStatus,
    }
  }
}
