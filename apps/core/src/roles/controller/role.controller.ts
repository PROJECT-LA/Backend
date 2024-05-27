import { Controller, Inject } from '@nestjs/common'
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '../dto'
import { BaseController, SharedService } from '@app/common'
import { RoleService } from '../service'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

@Controller('roles')
export class RoleController extends BaseController {
  constructor(
    private readonly roleService: RoleService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }
  @MessagePattern({ cmd: 'create-role' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { createRoleDto }: { createRoleDto: CreateRoleDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.roleService.create(createRoleDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'get-roles' })
  async findAll(
    @Ctx() context: RmqContext,
    @Payload() { paginacionQueryDto }: { paginacionQueryDto: FilterRoleDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.roleService.list(paginacionQueryDto)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'update-role' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    { id, updateRoleDto }: { id: string; updateRoleDto: UpdateRoleDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.roleService.updateRole(id, updateRoleDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'delete-role' })
  async remove(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.roleService.deleteRole(id)
    return this.successDelete(result)
  }

  @MessagePattern({ cmd: 'change-status-role' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { id }: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.roleService.changeRoleState(id)
    return this.successUpdate(result)
  }
}
