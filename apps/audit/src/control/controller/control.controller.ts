import { Controller, Inject } from '@nestjs/common'
import { BaseController, FilterTemplateDto, SharedService } from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { ControlService } from '../service'
import {
  CreateControlDto,
  UpdateControlDto,
} from '@app/common/dto/audit/control'

@Controller('controls')
export class ControlController extends BaseController {
  constructor(
    private controlService: ControlService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'get-control' })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    {
      id,
      paginationQueryDto,
    }: { id: string; paginationQueryDto: FilterTemplateDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.list(id, paginationQueryDto)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'create-control' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { controlDto }: { controlDto: CreateControlDto },
  ) {
    console.group(controlDto)
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.create(controlDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-control' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    { id, controlDto }: { id: string; controlDto: UpdateControlDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.update(id, controlDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'change-status-control' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { id }: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.changeStatus(id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'delete-control' })
  async delete(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.controlService.delete(id)
    return this.successDelete(result)
  }
}
