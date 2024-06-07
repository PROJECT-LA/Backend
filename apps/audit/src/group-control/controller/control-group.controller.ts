import { Controller, Inject } from '@nestjs/common'
import { BaseController, SharedService } from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import {
  CreateControlDto,
  FilterControlDto,
  UpdateControlDto,
} from '@app/common/dto/audit/control'
import { ControlGroupService } from '../service'

@Controller('controls')
export class ControlController extends BaseController {
  constructor(
    private controlGroupService: ControlGroupService,
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
    const result = await this.controlGroupService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'create-control' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { controlDto }: { controlDto: CreateControlDto },
  ) {
    console.group(controlDto)
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.create(controlDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-control' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    { id, controlDto }: { id: string; controlDto: UpdateControlDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.update(id, controlDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'change-status-control' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { id }: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.changeStatus(id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'delete-control' })
  async delete(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlGroupService.delete(id)
    return this.successDelete(result)
  }
}
