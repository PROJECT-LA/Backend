import { Controller, Delete, Get, Inject, Query } from '@nestjs/common'
import { BaseController, PaginationQueryDto, SharedService } from '@app/common'
import { ParameterService } from '../service'
import { CreateParameterDto, UpdateParameterDto } from '../dto'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

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
  @Get()
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    { paginacionQueryDto }: { paginacionQueryDto: PaginationQueryDto },
  ) {
    console.log(paginacionQueryDto)
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.list(paginacionQueryDto)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'get-groups' })
  async findByGroup(
    @Ctx() context: RmqContext,
    @Payload() { group }: { group: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.findByGroup(group)
    return this.successList(result)
  }

  @MessagePattern({ cmd: 'create-parameter' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { parametroDto }: { parametroDto: CreateParameterDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.create(parametroDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-parameter' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    { id, parametroDto }: { id: string; parametroDto: UpdateParameterDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.update(id, parametroDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'change-status-parameter' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { id }: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.changeStatus(id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'delete-parameter' })
  @Delete(':id')
  async delete(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.parameterService.delete(id)
    return this.successDelete(result)
  }
}
