import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateAuditDto,
  FilterAuditDto,
  STATUS,
  UpdateAuditDto,
} from '@app/common'
import { IAuditRepository } from '../interface'
import { ILevelRepository } from '../../level/interfaces'
import { RpcException } from '@nestjs/microservices'
import { Equal, FindManyOptions, Like } from 'typeorm'

@Injectable()
export class AuditService {
  constructor(
    @Inject('IAuditRepository')
    private auditRepository: IAuditRepository,
    @Inject('ILevelRepository')
    private levelRepository: ILevelRepository,
  ) {}

  async getAuditById(id: string) {
    const audit = await this.auditRepository.findOneByCondition({
      where: { id },
    })
    if (!audit) {
      throw new RpcException(new NotFoundException('Auditoria no encontrado'))
    }
    return audit
  }

  async list(filterDto: FilterAuditDto) {
    const { skip, limit, filter, idClient } = filterDto
    const options: FindManyOptions = {
      ...(filter && {
        where: [
          {
            objective: Like(`%${filter}%`),
            description: Like(`%${filter}%`),
          },
          {
            idClient: Equal(idClient),
          },
        ],
      }),
      relations: ['assessment', 'level', 'personal', 'template'],
      skip,
      take: limit,
    }
    return await this.auditRepository.getPaginateItems(options)
  }

  async create(auditDto: CreateAuditDto) {
    const newAudit = this.auditRepository.create(auditDto)
    await this.Validate(newAudit.idClient, newAudit.idLevel)
    return await this.auditRepository.save(newAudit)
  }

  async update(id: string, auditDto: UpdateAuditDto) {
    await this.getAuditById(id)
    const updateAudit = this.auditRepository.create(auditDto)
    await this.Validate(updateAudit.idClient, updateAudit.idLevel)
    return await this.auditRepository.update(id, auditDto)
  }

  async delete(id: string) {
    await this.getAuditById(id)
    return await this.auditRepository.delete(id)
  }

  async changeStatus(id: string) {
    const audit = await this.getAuditById(id)
    audit.status =
      audit.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    return await this.auditRepository.update(id, audit)
  }

  async Validate(idClient: string, idLevel: string) {
    const level = await this.levelRepository.findOneById(idLevel)
    if (!level) {
      throw new RpcException(
        new NotFoundException('No existe el nivel selecionado'),
      )
    }
  }
}
