import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ModuleEntity } from '../entities'
import { IModuleRepository } from '../interfaces'

@Injectable()
export class ModuleRepository
  extends BaseRepository<ModuleEntity>
  implements IModuleRepository
{
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly module: Repository<ModuleEntity>,
  ) {
    super(module)
  }
}
