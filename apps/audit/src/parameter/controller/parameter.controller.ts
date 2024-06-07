import { Controller, Inject } from '@nestjs/common'
import {
  BaseController,
  CreateParameterDto,
  PaginationQueryDto,
  ParamIdDto,
  SharedService,
  UpdateParameterDto,
} from '@app/common'
import { ParameterService } from '../service'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { ParamGroupDto } from '@app/common/dto/audit/parameter'

@Controller('parameters')
export class ParameterController extends BaseController {
  constructor(
    private parameterService: ParameterService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'get-parameters' })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    { filter }: { filter: PaginationQueryDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'get-groups' })
  async findByGroup(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamGroupDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.findByGroup(param.group)
    return this.successList(result)
  }

  @MessagePattern({ cmd: 'create-parameter' })
  async create(
    @Ctx() context: RmqContext,
    @Payload()
    { createParameterDto }: { createParameterDto: CreateParameterDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.create(createParameterDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-parameter' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      updateParameterDto,
    }: { param: ParamIdDto; updateParameterDto: UpdateParameterDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.update(
      param.id,
      updateParameterDto,
    )
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'change-status-parameter' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.changeStatus(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'remove-parameter' })
  async delete(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.delete(param.id)
    return this.successDelete(result)
  }
}
