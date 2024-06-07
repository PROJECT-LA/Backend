import { Controller, Inject } from '@nestjs/common'
import {
  BaseController,
  CreateControlGroupDto,
  FilterControlGroupDto,
  ParamIdDto,
  SharedService,
  UpdateControlGroupDto,
} from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { ControlGroupService } from '../service'

@Controller('controls-group')
export class ControlController extends BaseController {
  constructor(
    private controlGroupService: ControlGroupService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'get-control-group' })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    { filter }: { filter: FilterControlGroupDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'create-control' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { controlGroupDto }: { controlGroupDto: CreateControlGroupDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.create(controlGroupDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-control-group' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      updateControlGroupDto,
    }: { param: ParamIdDto; updateControlGroupDto: UpdateControlGroupDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.update(
      param.id,
      updateControlGroupDto,
    )
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'change-status-control-group' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.changeStatus(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'remove-control-group' })
  async remove(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.delete(param.id)
    return this.successDelete(result)
  }
}
