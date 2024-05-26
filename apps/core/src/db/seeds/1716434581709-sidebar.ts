import { MigrationInterface, QueryRunner } from 'typeorm'
import { ModuleEntity } from '../../modules/entities'

export class Sidebar1716434581709 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        url: '/principal',
        title: 'Principal',
        description: 'Sección principal',
        order: 1,
        subMenus: [
          {
            url: '/admin/home',
            title: 'Inicio',
            icono: 'home',
            description: 'Vista de bienvenida con características del sistema',
            order: 1,
          },
          {
            url: '/admin/profile',
            title: 'Perfil',
            icono: 'user',
            description: 'Información del perfil de usuario que inicio sesión',
            order: 2,
          },
        ],
      },
      {
        url: '/configuraciones',
        title: 'Configuración',
        description: 'Sección de configuraciones',
        order: 2,
        subMenus: [
          {
            url: '/admin/users',
            title: 'Usuarios',
            icono: 'users',
            description: 'Control de usuarios del sistema',
            order: 1,
          },
          {
            url: '/admin/parameters',
            title: 'Parámetros',
            icono: 'settings-2',
            description: 'Parámetros generales del sistema',
            order: 2,
          },
          {
            url: '/admin/modules',
            title: 'Módulos',
            icono: 'package-open',
            description: 'Gestión de módulos',
            order: 3,
          },
          {
            url: '/admin/policies',
            title: 'Permisos',
            icono: 'lock',
            description: 'Control de permisos para los usuarios',
            order: 4,
          },
          {
            url: '/admin/roles',
            title: 'Roles',
            icono: 'notebook',
            description: 'Control de roles para los usuarios',
            order: 5,
          },
        ],
      },
    ]

    for (const item of items) {
      const modulo = await queryRunner.manager.save(
        new ModuleEntity({
          title: item.title,
          url: item.url,
          description: item.description,
          order: item.order,
          status: 'ACTIVO',
          icon: null,
        }),
      )

      for (const subMenu of item.subMenus) {
        await queryRunner.manager.save(
          new ModuleEntity({
            url: subMenu.url,
            title: subMenu.title,
            idModule: modulo.id,
            icon: subMenu.icono,
            description: subMenu.description,
            order: subMenu.order,
            status: 'ACTIVO',
          }),
        )
      }
    }
  }

  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
