import { MigrationInterface, QueryRunner } from 'typeorm'
import { ModuleEntity } from '../../src/modules/entities'

export class SidebarGerency1716434581710 implements MigrationInterface {
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
        url: '/auditorias',
        title: 'Auditorías',
        description: 'Sección de Configuracion de Auditorias',
        order: 2,
        subMenus: [
          {
            url: '/admin/plantillas',
            title: 'Plantillas',
            icono: 'scale',
            description: 'Gestión de Plantillas',
            order: 1,
          },
          {
            url: '/admin/levels',
            title: 'Niveles de Madurez',
            icono: 'line-chart',
            description: 'Parámetros generales del sistema',
            order: 2,
          },
          {
            url: '/admin/controls',
            title: 'Controles',
            icono: 'file-sliders',
            description: 'Parámetros generales del sistema',
            order: 3,
          },
          {
            url: '/admin/audits',
            title: 'Auditorías',
            icono: 'file-stack',
            description: 'Auditorias del sistemas',
            order: 4,
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
            url: '/admin/parameters',
            title: 'Parámetros',
            icono: 'settings-2',
            description: 'Parámetros generales del sistema',
            order: 1,
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
          idRole: '2',
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
            idRole: '2',
          }),
        )
      }
    }
  }

  //eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
