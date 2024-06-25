import { Controller, Inject } from '@nestjs/common'
import {
  AuditMessages,
  BaseController,
  ParamIdDto,
  SharedService,
} from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { AuditService } from '../service'
import {
  AuditStatusDto,
  CreateAuditDto,
  FilterAuditDto,
  UpdateAuditDto,
} from '@app/common/dto/audit/audit'

@Controller('audits')
export class AuditController extends BaseController {
  constructor(
    private auditService: AuditService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: AuditMessages.GET_AUDIT })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    { filter }: { filter: FilterAuditDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.auditService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: AuditMessages.CREATE_AUDIT })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { createAuditDto }: { createAuditDto: CreateAuditDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.auditService.create(createAuditDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: AuditMessages.UPDATE_AUDIT })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      updateAuditDto,
    }: { param: ParamIdDto; updateAuditDto: UpdateAuditDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.auditService.update(param.id, updateAuditDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: AuditMessages.CHANGE_STATUS_AUDIT })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload()
    { param, auditStatus }: { param: ParamIdDto; auditStatus: AuditStatusDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.auditService.changeStatus(
      param.id,
      auditStatus.status,
    )
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: AuditMessages.REMOVE_AUDIT })
  async remove(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.auditService.delete(param.id)
    return this.successDelete(result)
  }
}
