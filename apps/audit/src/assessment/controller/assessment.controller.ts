import { Controller, Delete, Inject } from '@nestjs/common'
import {
  AssessmentMessages,
  BaseController,
  CreateAssessmentDto,
  FilterAssessmentDto,
  ParamIdDto,
  SharedService,
  UpdateAssessmentDTo,
  validatePayload,
} from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import { AssessmentService } from '../service/assement.service'

@Controller('assessments')
export class AssessmentController extends BaseController {
  constructor(
    private assessmentService: AssessmentService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: AssessmentMessages.GET_ASSESSMENTS })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    payload: { filter: FilterAssessmentDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const filter = await validatePayload(FilterAssessmentDto, payload.filter)
    const result = await this.assessmentService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: AssessmentMessages.CREATE_ASSESSMENT })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { assessmentDto }: { assessmentDto: CreateAssessmentDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.assessmentService.create(assessmentDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: AssessmentMessages.UPDATE_ASSESSMENT })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    {
      param,
      assessmentDto,
    }: { param: ParamIdDto; assessmentDto: UpdateAssessmentDTo },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.assessmentService.update(param.id, assessmentDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: AssessmentMessages.CHANGE_STATUS_ASSESSMENT })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.assessmentService.changeAsessmentState(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: AssessmentMessages.REMOVE_ASSESSMENT })
  @Delete(':id')
  async remove(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.assessmentService.delete(param.id)
    return this.successDelete(result)
  }
}
