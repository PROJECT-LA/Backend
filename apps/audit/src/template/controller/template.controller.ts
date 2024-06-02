import { Controller, Delete, Inject } from '@nestjs/common'
import {
  BaseController,
  CreateTemplateDto,
  FilterTemplateDto,
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
    { paginationQueryDto }: { paginationQueryDto: FilterTemplateDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.list(paginationQueryDto)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'create-template' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { templateDto }: { templateDto: CreateTemplateDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.create(templateDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-template' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    { id, templateDto }: { id: string; templateDto: UpdateTemplateDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.update(id, templateDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'change-status-template' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { id }: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.changeTemplateState(id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'delete-template' })
  @Delete(':id')
  async delete(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.templateService.delete(id)
    return this.successDelete(result)
  }
}
