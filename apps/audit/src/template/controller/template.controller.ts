import { Controller, Delete, Inject } from '@nestjs/common'
import {
  BaseController,
  CreateTemplateDto,
  FilterTemplateDto,
  ParamIdDto,
  SharedService,
  UpdateTemplateDto,
} from '@app/common'
import { TemplateService } from '../service'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

@Controller('templates')
export class TemplateController extends BaseController {
  constructor(
    private templateService: TemplateService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'get-templates' })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    { filter }: { filter: FilterTemplateDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'create-template' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { createTemplateDto }: { createTemplateDto: CreateTemplateDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.create(createTemplateDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-template' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      updateTemplateDto,
    }: { param: ParamIdDto; updateTemplateDto: UpdateTemplateDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.update(
      param.id,
      updateTemplateDto,
    )
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'change-status-template' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.changeTemplateState(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'remove-template' })
  async delete(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.delete(param.id)
    return this.successDelete(result)
  }
}
