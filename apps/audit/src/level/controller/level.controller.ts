import { Controller, Delete, Inject } from '@nestjs/common'
import { BaseController, SharedService } from '@app/common'
import { LevelService } from '../service'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import {
  CreateLevelDto,
  FilterLevelDto,
  UpdateLevelDto,
} from '@app/common/dto/audit/level'

@Controller('templates')
export class LevelController extends BaseController {
  constructor(
    private levelService: LevelService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'get-levels' })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    { paginationQueryDto }: { paginationQueryDto: FilterLevelDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.levelService.list(paginationQueryDto)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: 'create-level' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { levelDto }: { levelDto: CreateLevelDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.levelService.create(levelDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'update-level' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    { id, levelDto }: { id: string; levelDto: UpdateLevelDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.levelService.update(id, levelDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'change-status-level' })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { id }: { id: string },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.levelService.changeTemplateState(id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'delete-level' })
  @Delete(':id')
  async delete(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.levelService.delete(id)
    return this.successDelete(result)
  }
}
