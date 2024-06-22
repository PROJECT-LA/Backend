import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Control } from '../entities'
import { IControlRepository } from '../interface'

@Injectable()
export class ControlRepository
  extends BaseRepository<Control>
  implements IControlRepository
{
  constructor(
    @InjectRepository(Control)
    private readonly control: Repository<Control>,
  ) {
    super(control)
  }
}
