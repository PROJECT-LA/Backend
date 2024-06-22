import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Template } from '../entities'
import { ITemplateRepository } from '../interface'

@Injectable()
export class TemplateRepository
  extends BaseRepository<Template>
  implements ITemplateRepository
{
  constructor(
    @InjectRepository(Template)
    private readonly template: Repository<Template>,
  ) {
    super(template)
  }
}
