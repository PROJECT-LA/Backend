import { Controller, Inject } from '@nestjs/common'
import {
  BaseController,
  ControlMessages,
  CreateControlDto,
  FilterControlDto,
  ParamIdDto,
  SharedService,
  UpdateControlDto,
} from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { ControlService } from '../service'

@Controller('controls')
export class ControlController extends BaseController {
  constructor(
    private controlService: ControlService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: ControlMessages.GET_CONTROLS })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    { filter }: { filter: FilterControlDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: ControlMessages.CREATE_CONTROL })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { controlDto }: { controlDto: CreateControlDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.create(controlDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: ControlMessages.UPDATE_CONTROL })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    { param, controlDto }: { param: ParamIdDto; controlDto: UpdateControlDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.update(param.id, controlDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: ControlMessages.CHANGE_STATUS_CONTROL })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.changeStatus(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: ControlMessages.REMOVE_CONTROL })
  async remove(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.delete(param.id)
    return this.successDelete(result)
  }
}
