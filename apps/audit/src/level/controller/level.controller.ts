import { Controller, Delete, Inject } from '@nestjs/common'
import {
  BaseController,
  LevelMessages,
  ParamIdDto,
  SharedService,
  validatePayload,
} from '@app/common'
import { LevelService } from '../service'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'
import {
  CreateLevelDto,
  FilterLevelDto,
  UpdateLevelDto,
} from '@app/common/dto/audit/level'

@Controller('levels')
export class LevelController extends BaseController {
  constructor(
    private levelService: LevelService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: LevelMessages.GET_LEVELS })
  async list(
    @Ctx() context: RmqContext,
    @Payload()
    payload: { filter: FilterLevelDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const filter = await validatePayload(FilterLevelDto, payload.filter)
    const result = await this.levelService.list(filter)
    return this.successListRows(result)
  }

  @MessagePattern({ cmd: LevelMessages.CREATE_LEVEL })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { levelDto }: { levelDto: CreateLevelDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.levelService.create(levelDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: LevelMessages.UPDATE_LEVEL })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    { param, levelDto }: { param: ParamIdDto; levelDto: UpdateLevelDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.levelService.update(param.id, levelDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: LevelMessages.CHANGE_STATUS_LEVEL })
  async changeStatus(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.levelService.changeLevelState(param.id)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: LevelMessages.REMOVE_LEVEL })
  @Delete(':id')
  async remove(
    @Ctx() context: RmqContext,
    @Payload() { param }: { param: ParamIdDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.levelService.delete(param.id)
    return this.successDelete(result)
  }
}
