import { Inject, Injectable, PreconditionFailedException } from '@nestjs/common'
import { Messages } from 'src/common/constants'
import { RolesRepository } from '../repository'
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '../dto'

@Injectable()
export class RolesService {
  constructor(
    @Inject(RolesRepository)
    private readonly roleRepository: RolesRepository
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    await this.validateRole(createRoleDto.name)
    const newRole = this.roleRepository.create(createRoleDto)
    return await this.roleRepository.save(newRole)
  }

  async findOneById(id: string) {
    const role = await this.roleRepository.findOneById(id)
    if (!role)
      throw new PreconditionFailedException(Messages.EXCEPTION_ROLE_NOT_FOUND)
    return role
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    await this.validateRole(updateRoleDto.name, id)
    return await this.roleRepository.update(id, updateRoleDto)
  }

  async delete(id: string) {
    await this.findOneById(id)
    return await this.roleRepository.delete(id)
  }

  async validateRole(name: string, idRole?: string) {
    if (idRole) {
      await this.findOneById(idRole)
    }
    const role = await this.roleRepository.findOneByRoleName(name)
    if (role && (idRole === undefined || role.id !== idRole)) {
      throw new PreconditionFailedException(Messages.EXCEPTION_ROLE_NAME_EXISTS)
    }
  }
  async findAll(paginacionQueryDto: FilterRoleDto) {
    return await this.roleRepository.findAll(paginacionQueryDto)
  }
}
