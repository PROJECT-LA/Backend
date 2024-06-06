import { Inject } from '@nestjs/common'
import { CreateRoleDto, FilterRoleDto, UpdateRoleDto } from '../dto'
import { BaseController, ParamIdDto, SharedService } from '@app/common'
import { RoleService } from '../service'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

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
    @Payload() { filter }: { filter: FilterRoleDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.roleService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'update-role' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      updateRoleDto,
    }: { param: ParamIdDto; updateRoleDto: UpdateRoleDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.roleService.updateRole(param.id, updateRoleDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'delete-role' })
  async remove(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.roleService.deleteRole(param.id)
    return this.successDelete(result)
  }

  @MessagePattern({ cmd: 'change-status-role' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.roleService.changeRoleState(param.id)
    return this.successUpdate(result)
  }
}
