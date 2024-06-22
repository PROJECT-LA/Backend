import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'

import { ILevelRepository } from '../interfaces'
import { Level } from '../entities'

@Injectable()
export class LevelRepository
  extends BaseRepository<Level>
  implements ILevelRepository
{
  constructor(
    @InjectRepository(Level)
    private readonly level: Repository<Level>,
  ) {
    super(level)
  }
}
