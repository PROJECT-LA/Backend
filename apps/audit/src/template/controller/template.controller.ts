import { Controller, Inject } from '@nestjs/common'
import {
  BaseController,
  CreateTemplateDto,
  FilterTemplateDto,
  ParamIdDto,
  SharedService,
  TemplateMessages,
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

  @MessagePattern({ cmd: TemplateMessages.GET_TEMPLATES })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    { filter }: { filter: FilterTemplateDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: TemplateMessages.CREATE_TEMPLATE })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { templateDto }: { templateDto: CreateTemplateDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.create(templateDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: TemplateMessages.UPDATE_TEMPLATE })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      templateDto,
    }: { param: ParamIdDto; templateDto: UpdateTemplateDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.update(param.id, templateDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: TemplateMessages.CHANGE_STATUS_TEMPLATE })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.changeTemplateState(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: TemplateMessages.REMOVE_TEMPLATE })
  async delete(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.delete(param.id)
    return this.successDelete(result)
  }
}
