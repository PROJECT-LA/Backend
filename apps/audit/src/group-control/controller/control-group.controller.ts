import { Controller, Inject } from '@nestjs/common'
import {
  BaseController,
  ControlGroupMessages,
  CreateControlGroupDto,
  FilterControlGroupDto,
  ParamIdDto,
  SharedService,
  UpdateControlGroupDto,
} from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { ControlGroupService } from '../service'

@Controller('control-groups')
export class ControlGroupController extends BaseController {
  constructor(
    private controlGroupService: ControlGroupService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: ControlGroupMessages.GET_CONTROL_GROUPS })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    { filter }: { filter: FilterControlGroupDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: ControlGroupMessages.CREATE_CONTROL_GROUP })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { controlGroupDto }: { controlGroupDto: CreateControlGroupDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.create(controlGroupDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: ControlGroupMessages.UPDATE_CONTROL_GROUP })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      controlGroupDto,
    }: { param: ParamIdDto; controlGroupDto: UpdateControlGroupDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.update(
      param.id,
      controlGroupDto,
    )
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: ControlGroupMessages.CHANGE_STATUS_CONTROL_GROUP })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.changeStatus(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: ControlGroupMessages.REMOVE_CONTROL_GROUP })
  async remove(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.delete(param.id)
    return this.successDelete(result)
  }
}
