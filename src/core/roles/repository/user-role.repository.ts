import { Injectable } from '@nestjs/common'
import { Role, UserRole } from '../entities'
import { BaseAbstractRepostitory } from 'src/common/abstract/base.repository'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/core/users'

@Injectable()
export class UsuarioRolRepository extends BaseAbstractRepostitory<UserRole> {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>
  ) {
    super(userRoleRepository)
  }

  async fSS(idUser: string) {
    return await super.findWithRelations({
      where: [{ idUser }],
      relations: ['role'],
    })
  }

  async activar(
    idUsuario: string,
    roles: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(UsuarioRol) ??
      this.dataSource.getRepository(UsuarioRol)
    )
      .createQueryBuilder()
      .update(UsuarioRol)
      .set({
        estado: Status.ACTIVE,
        usuarioModificacion: usuarioAuditoria,
      })
      .where('id_usuario = :idUsuario', { idUsuario })
      .andWhere('id_rol IN(:...ids)', { ids: roles })
      .execute()
  }

  async inactivar(
    idUsuario: string,
    roles: Array<string>,
    usuarioAuditoria: string,
    transaction?: EntityManager
  ) {
    return await (
      transaction?.getRepository(UsuarioRol) ??
      this.dataSource.getRepository(UsuarioRol)
    )
      .createQueryBuilder()
      .update(UsuarioRol)
      .set({
        estado: Status.INACTIVE,
        usuarioModificacion: usuarioAuditoria,
      })
      .where('id_usuario = :idUsuario', { idUsuario })
      .andWhere('id_rol IN(:...ids)', { ids: roles })
      .execute()
  }

  async crear(idUsuario: string, roles: Array<string>) {
    const usuarioRoles = roles.map((idRol) => {
      const usuario = new User()
      usuario.id = idUsuario

      const rol = new Role()
      rol.id = idRol

      const usuarioRol = new UsuarioRol()
      usuarioRol.usuario = usuario
      usuarioRol.rol = rol
      usuarioRol.usuarioCreacion = usuarioAuditoria

      return usuarioRol
    })

    return await (
      transaction?.getRepository(UsuarioRol) ??
      this.dataSource.getRepository(UsuarioRol)
    ).save(usuarioRoles)
  }
  async saveMany(data: DeepPartial<UserRole>[]): Promise<UserRole[]> {
    return await this.userRoleRepository.save(data)
  }
}
