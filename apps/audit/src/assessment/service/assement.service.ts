import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateAssessmentDto,
  FilterAssessmentDto,
  STATUS,
  UpdateAssessmentDTo,
} from '@app/common'
import {} from '@app/common/dto/audit/level'
import { RpcException } from '@nestjs/microservices'
import { Equal } from 'typeorm'
import { IAssessmentRepository } from '../interfaces'

@Injectable()
export class AssessmentService {
  constructor(
    @Inject('IAssessmentRepository')
    private readonly assessmentReository: IAssessmentRepository,
  ) {}

  async getAssessmentlById(id: string) {
    const assessment = await this.assessmentReository.findOneById(id)
    if (!assessment)
      throw new RpcException(new NotFoundException('Evaluacion no encontrada'))
    return assessment
  }

  async create(assesmentDto: CreateAssessmentDto) {
    const newAssessment = this.assessmentReository.create(assesmentDto)
    return await this.assessmentReository.save(newAssessment)
  }

  async update(id: string, assesmentDto: UpdateAssessmentDTo) {
    await this.getAssessmentlById(id)
    const updateAssessment = this.assessmentReository.create(assesmentDto)
    return await this.assessmentReository.update(id, updateAssessment)
  }

  async delete(id: string) {
    await this.getAssessmentlById(id)
    return await this.assessmentReository.delete(id)
  }

  async list(paginationQueryDto: FilterAssessmentDto) {
    const { skip, limit, filter, idAudit } = paginationQueryDto
    const options = {
      ...(filter && {
        where: { idAudit: Equal(idAudit) },
      }),
      skip,
      take: limit,
    }
    return await this.assessmentReository.getPaginateItems(options)
  }

  async changeAsessmentState(idTemplate: string) {
    const level = await this.assessmentReository.findOneById(idTemplate)
    const newStatus =
      level.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    await this.assessmentReository.update(idTemplate, { status: newStatus })
  }
}
