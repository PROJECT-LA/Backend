import { Controller, Inject } from '@nestjs/common'
import {
  BaseController,
  CreateControlDto,
  FilterControlDto,
  ParamIdDto,
  SharedService,
  UpdateControlDto,
} from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { ControlService } from '../service'

@Controller('controls')
export class ControlGroupController extends BaseController {
  constructor(
    private controlService: ControlService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'get-controls' })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    { filter }: { filter: FilterControlDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'create-control' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { createControDto }: { createControDto: CreateControlDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.create(createControDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-control' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      updateControlDto,
    }: { param: ParamIdDto; updateControlDto: UpdateControlDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.update(param.id, updateControlDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'change-status-control' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.changeStatus(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'remove-control' })
  async remove(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.delete(param.id)
    return this.successDelete(result)
  }
}
