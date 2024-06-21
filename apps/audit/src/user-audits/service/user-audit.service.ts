import { Inject, Injectable, PreconditionFailedException } from '@nestjs/common'
import { CreatePersonalDto, FilterUserAuditDto, STATUS } from '@app/common'
import { IUserAuditRepository } from '../interface'

@Injectable()
export class UserAuditService {
  constructor(
    @Inject('IUserAuditRepository')
    private readonly userAuditRepository: IUserAuditRepository,
  ) {}

  async getPersonalById(id: string) {
    const personal = await this.userAuditRepository.findOneById(id)
    if (!personal)
      throw new PreconditionFailedException('Auditor no encontrado')
    return personal
  }

  async create(personalDto: CreatePersonalDto) {
    console.log(personalDto)
    const newPersonal = this.userAuditRepository.create(personalDto)
    //await this.externalUserService.getUser(personalDto.idUser)
    return await this.userAuditRepository.save(newPersonal)
  }

  async delete(id: string) {
    await this.getPersonalById(id)
    return await this.userAuditRepository.delete(id)
  }

  async list(paginationQueryDto: FilterUserAuditDto) {
    return await this.userAuditRepository.findAll({
      where: { idAudit: paginationQueryDto.idAudit },
    })
  }

  async changePersonalState(idTemplate: string) {
    const level = await this.userAuditRepository.findOneById(idTemplate)
    const newStatus =
      level.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    await this.userAuditRepository.update(idTemplate, { status: newStatus })
  }
}
