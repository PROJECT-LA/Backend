import { Inject } from '@nestjs/common'
import {
  BaseController,
  PassportUser,
  SharedService,
  CreatePolicyDto,
  FilterPoliciesDto,
  RouteDto,
  ParamIdDto,
  PolicyMessages,
  validatePayload,
} from '@app/common'
import { PolicyService } from '../service'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

export class PolicyController extends BaseController {
  constructor(
    private policyService: PolicyService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: PolicyMessages.CREATE_POLICY })
  async createPolicy(
    @Ctx() context: RmqContext,
    @Payload() { policy }: { policy: CreatePolicyDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.createPolicie(policy)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: PolicyMessages.UPDATE_POLICY })
  async updatePolicy(
    @Ctx() context: RmqContext,
    @Payload()
    {
      oldPolicy,
      newPolicy,
    }: { oldPolicy: CreatePolicyDto; newPolicy: CreatePolicyDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.updatePolicie(oldPolicy, newPolicy)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: PolicyMessages.GET_POLICIES })
  async getPolicies(
    @Ctx() context: RmqContext,
    @Payload() payload: { filter: FilterPoliciesDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const filter = await validatePayload(FilterPoliciesDto, payload.filter)
    const result = await this.policyService.findAll(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: PolicyMessages.REMOVE_POLICY })
  async removePolicy(
    @Ctx() context: RmqContext,
    @Payload() { policy }: { policy: CreatePolicyDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.deletePolicie(policy)
    return this.successDelete(result)
  }

  @MessagePattern({ cmd: PolicyMessages.GET_ROUTE_POLICY })
  async getPoliciesByRoute(
    @Ctx() context: RmqContext,
    @Payload() { user, routeDto }: { routeDto: RouteDto; user: PassportUser },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.getPoliciesByRoute(
      routeDto.route,
      user,
    )
    return this.successList(result)
  }

  @MessagePattern({ cmd: PolicyMessages.CHANGE_STATUS_POLICY })
  async changeStatusPolicy(
    @Ctx() context: RmqContext,
    @Payload() { policy }: { policy: CreatePolicyDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.changeStatusPolicy(policy)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: PolicyMessages.GET_POLICIES_ROLE_FRONTEND })
  async getPoliciesFrontenByRoute(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.getPoliciesByRouteFrontend(param.id)
    return this.successList(result)
  }
}
