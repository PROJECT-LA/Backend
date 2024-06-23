import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { BaseRepository } from '@app/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Assessment } from '../entity'
import { IAssessmentRepository } from '../interfaces'

@Injectable()
export class AssessmentRepository
  extends BaseRepository<Assessment>
  implements IAssessmentRepository
{
  constructor(
    @InjectRepository(Assessment)
    private readonly assessment: Repository<Assessment>,
  ) {
    super(assessment)
  }
}
