import { Controller, Inject } from '@nestjs/common'
import { UserService } from '../service'
import { CreateUserDto, FilterUserDto, UpdateUserDto } from '../dto'
import { BaseController, SharedService } from '@app/common'
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices'

@Controller('users')
export class UserController extends BaseController {
  constructor(
    private readonly usersService: UserService,
    @Inject('SharedServiceInterface')
    private readonly sharedService: SharedService,
  ) {
    super()
  }

  @MessagePattern({ cmd: 'create-user' })
  async create(
    @Ctx() context: RmqContext,
    @Payload() { createUserDto }: { createUserDto: CreateUserDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.create(createUserDto)
    return this.successCreate(result)
  }

  @MessagePattern({ cmd: 'get-users' })
  async findAll(
    @Ctx() context: RmqContext,
    @Payload() { paginacionQueryDto }: { paginacionQueryDto: FilterUserDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.list(paginacionQueryDto)
    return this.successListRows(result)
  }

  /*   @ApiOperation({ summary: 'API: para obtener un usuario' })
  @ApiProperty({
    type: ParamIdDto,
  })
  @Get(':id')
  async findOne(@Param() id: ParamIdDto) {
    const { id } = id
    return await this.usersService.findOneById(id)
  }

 */

  @MessagePattern({ cmd: 'update-user' })
  async update(
    @Ctx() context: RmqContext,
    @Payload()
    { id, updateUserDto }: { id: string; updateUserDto: UpdateUserDto },
  ) {
    this.sharedService.acknowledgeMessage(context)
    const result = await this.usersService.update(id, updateUserDto)
    return this.successUpdate(result)
  }

  @MessagePattern({ cmd: 'delete-user' })
  remove(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    this.sharedService.acknowledgeMessage(context)
    const result = this.usersService.delete(id)
    return this.successDelete(result)
  }

  @MessagePattern({ cmd: 'change-status-user' })
  async activar(@Ctx() context: RmqContext, @Payload() { id }: { id: string }) {
    const result = await this.usersService.changeStatus(id)
    this.sharedService.acknowledgeMessage(context)
    return this.successUpdate(result)
  }
}
