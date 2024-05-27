import { Controller, Inject } from '@nestjs/common'

import { BaseController, SharedService } from '@app/common'
import { ModuleService } from '../services'
import { CreateModuleDto, FilterModuleDto, UpdateModuleDto } from '../dto'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

@Controller('modules')
export class ModuleController extends BaseController {
  constructor(
    private moduleService: ModuleService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'get-modules' })
  async list(
    @Ctx() context: RmqContext,
    @Payload() { paginacionQueryDto }: { paginacionQueryDto: FilterModuleDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.moduleService.list(paginacionQueryDto)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'create-module' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { moduleDto }: { moduleDto: CreateModuleDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.moduleService.create(moduleDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-module' })
  async update(
    @Ctx() context: RmqContext,
    @Payload() { id, moduleDto }: { id: string; moduleDto: UpdateModuleDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.moduleService.update(id, moduleDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'delete-module' })
  async delete(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.moduleService.delete(id)
    return this.successDelete(result)
  }

  @MessagePattern({ cmd: 'change-status-module' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { id }: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.moduleService.changeStatus(id)
    return this.successUpdate(result)
  }
}
