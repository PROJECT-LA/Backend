import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateAuditDto,
  FilterAuditDto,
  STATUS,
  UpdateAuditDto,
} from '@app/common'
import { IAuditRepository } from '../interface'

@Injectable()
export class AuditService {
  constructor(
    @Inject('IAuditRepository')
    private auditRepository: IAuditRepository,
  ) {}

  async getAuditById(id: string) {
    const audit = await this.auditRepository.findOneByCondition({
      where: { id },
    })
    if (!audit) throw new NotFoundException('Auditoria no encontrado')
    return audit
  }

  async list(filterDto: FilterAuditDto) {
    return await this.auditRepository.list(filterDto)
  }

  async create(auditDto: CreateAuditDto) {
    const newModule = this.auditRepository.create(auditDto)
    console.log(newModule)
    return await this.auditRepository.save(newModule)
  }

  async update(id: string, auditDto: UpdateAuditDto) {
    await this.getAuditById(id)
    return await this.auditRepository.update(id, auditDto)
  }

  async delete(id: string) {
    await this.getAuditById(id)
    return await this.auditRepository.delete(id)
  }

  async changeStatus(id: string) {
    const audit = await this.auditRepository.findOneByCondition({
      where: { id },
    })
    audit.status =
      audit.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE

    return await this.auditRepository.save(audit)
  }
}
