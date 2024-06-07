import { Inject } from '@nestjs/common'
import {
  CreateModuleDto,
  NewOrderDto,
  UpdateModuleDto,
  BaseController,
  ParamIdDto,
  SharedService,
} from '@app/common'
import { ModuleService } from '../services'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

export class ModuleController extends BaseController {
  constructor(
    private moduleService: ModuleService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'get-modules' })
  async getModuleByRole(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.moduleService.getModulesByRole(param.id)
    return this.successList(result)
  }

  @MessagePattern({ cmd: 'create-module' })
  async createModule0(
    @Ctx() context: RmqContext,
    @Payload() { createModuleDto }: { createModuleDto: CreateModuleDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.moduleService.create(createModuleDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-module' })
  async updateModule(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      updateModuleDto,
    }: {
      param: ParamIdDto
      updateModuleDto: UpdateModuleDto
    },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.moduleService.update(param.id, updateModuleDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'remove-module' })
  async removeModule(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.moduleService.delete(param.id)
    return this.successDelete(result)
  }

  @MessagePattern({ cmd: 'change-status-module' })
  async changeStatusModule(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.moduleService.changeStatus(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'update-order-module' })
  async updateSidebar(
    @Ctx() context: RmqContext,
    @Payload() { orderDto }: { orderDto: NewOrderDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.moduleService.updateOrder(orderDto)
    return this.successUpdate(result)
  }
}
