import { Controller, Inject, UnauthorizedException } from '@nestjs/common'
import { BaseController, PassportUser, SharedService } from '@app/common'
import { CreatePolicyDto, FilterPoliciesDto, RouteDto } from '../dto'
import { PolicyService } from '../service'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

//@ApiBearerAuth()
//@ApiTags('Policies')
//@UseGuards(JwtAuthGuard, CasbinGuard)
@Controller('policies')
export class AuthorizationController extends BaseController {
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
    { policy, query }: { policy: CreatePolicyDto; query: CreatePolicyDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.updatePolicie(query, policy)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'get-policies' })
  async findAllPolicies(
    @Ctx() context: RmqContext,
    @Payload()
    { paginacionQueryDto }: { paginacionQueryDto: FilterPoliciesDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.findAll(paginacionQueryDto)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'delete-policy' })
  async eliminarPolitica(
    @Ctx() context: RmqContext,
    @Payload() { query }: { query: CreatePolicyDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.policyService.deletePolicie(query)
    return this.successDelete(result)
  }

  @MessagePattern({ cmd: 'get-authorization' })
  async getPoliciesByRoute(
    @Ctx() context: RmqContext,
    @Payload() { routeDto, user }: { routeDto: RouteDto; user: PassportUser },
  ) {
    this.sharedService.acknowledgeMessage(context)
    if (!user) throw new UnauthorizedException()
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
