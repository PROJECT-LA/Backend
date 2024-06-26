import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { CreateAuditDto, FilterAuditDto, UpdateAuditDto } from '@app/common'
import { IAuditRepository } from '../interface'
import { ILevelRepository } from '../../level/interfaces'
import { RpcException } from '@nestjs/microservices'
import { Equal, FindManyOptions, Like } from 'typeorm'
import { Audit } from '../entities'

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
    const { skip, limit, filter, idClient, status: auditStatus } = filterDto
    const options: FindManyOptions<Audit> = {
      where: [
        {
          idClient: Equal(idClient),
          status: Equal(auditStatus),
          objective: Like(`%${filter}%`),
        },
        {
          idClient: Equal(idClient),
          status: Equal(auditStatus),
          description: Like(`%${filter}%`),
        },
      ],
      relations: {
        assessment: true,
        level: true,
        personal: true,
        template: true,
      },
      select: {
        level: {
          id: true,
          name: true,
        },
        assessment: {
          id: true,
        },
        template: {
          id: true,
          name: true,
        },
      },
      skip,
      take: limit,
    }

    return await this.auditRepository.getPaginateItems(options)
  }

  async create(auditDto: CreateAuditDto) {
    const newAudit = this.auditRepository.create(auditDto)
    await this.Validate(newAudit.idClient, newAudit.idLevel)

    return await this.auditRepository.transactional(async (manager) => {
      await manager.save(Audit, newAudit)
    })
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

  async changeStatus(id: string, status: string) {
    const audit = await this.getAuditById(id)
    audit.status = status
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
