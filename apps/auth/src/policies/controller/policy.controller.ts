import { Inject } from '@nestjs/common'
import {
  BaseController,
  PassportUser,
  SharedService,
  CreatePolicyDto,
  FilterPoliciesDto,
  RouteDto,
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

  @MessagePattern({ cmd: 'create-policy' })
  async createPolicy(
    @Ctx() context: RmqContext,
    @Payload() { policy }: { policy: CreatePolicyDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.createPolicie(policy)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-policy' })
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

  @MessagePattern({ cmd: 'get-policies' })
  async getPolicies(
    @Ctx() context: RmqContext,
    @Payload() { filter }: { filter: FilterPoliciesDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.findAll(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'remove-policy' })
  async removePolicy(
    @Ctx() context: RmqContext,
    @Payload() { policy }: { policy: CreatePolicyDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.deletePolicie(policy)
    return this.successDelete(result)
  }

  @MessagePattern({ cmd: 'get-route-policy' })
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

  @MessagePattern({ cmd: 'change-status-policy' })
  async changeStatusPolicy(
    @Ctx() context: RmqContext,
    @Payload() { policy }: { policy: CreatePolicyDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.changeStatusPolicy(policy)
    return this.successUpdate(result)
  }
}
