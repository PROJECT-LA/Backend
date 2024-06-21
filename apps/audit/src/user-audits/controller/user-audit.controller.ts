import { Controller, Delete, Inject } from '@nestjs/common'
import {
  BaseController,
  CreatePersonalDto,
  FilterUserAuditDto,
  ParamIdDto,
  SharedService,
  UserAuditMessages,
} from '@app/common'

import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import {} from '@app/common/dto/audit/level'
import { UserAuditService } from '../service'

@Controller('user-audit')
export class UserAuditController extends BaseController {
  constructor(
    private auditorsController: UserAuditService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: UserAuditMessages.GET_USERS_AUDIT })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    { filter }: { filter: FilterUserAuditDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.auditorsController.list(filter)
    return this.successList(result)
  }

  @MessagePattern({ cmd: UserAuditMessages.CREATE_USER_AUDIT })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { personalDto }: { personalDto: CreatePersonalDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.auditorsController.create(personalDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: UserAuditMessages.CHANGE_STATUS_AUDIT })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.auditorsController.changePersonalState(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: UserAuditMessages.REMOVE_USER_AUDIT })
  @Delete(':id')
  async delete(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.auditorsController.delete(param.id)
    return this.successDelete(result)
  }
}
