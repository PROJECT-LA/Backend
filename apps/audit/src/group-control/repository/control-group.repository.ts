import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ControlGroup } from '../entities'
import { IControlGroupRepository } from '../interface'

@Injectable()
export class ControlGroupRepository
  extends BaseRepository<ControlGroup>
  implements IControlGroupRepository
{
  constructor(
    @InjectRepository(ControlGroup)
    private readonly control: Repository<ControlGroup>,
  ) {
    super(control)
  }
}
