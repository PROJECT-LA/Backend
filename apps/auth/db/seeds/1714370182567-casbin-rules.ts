import { MigrationInterface, QueryRunner } from 'typeorm'
import { RoleEnum } from '../../src/policies/constants'
import { CasbinRule } from '../../src/policies/entitites/casbin.entity'

export class CasbinRules1714370182567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const frontendRoutes: CasbinValue = {
      '/admin/home': {
        [RoleEnum.ADMINISTRADOR]: 'read|update|create|delete',
        [RoleEnum.GERENTE]: 'read|update|create|delete',
      },
      '/admin/profile': {
        [RoleEnum.ADMINISTRADOR]: 'read|update|create|delete',
        [RoleEnum.GERENTE]: 'read|update|create|delete',
      },
      '/admin/users': {
        [RoleEnum.ADMINISTRADOR]: 'read|update|create|delete',
        [RoleEnum.GERENTE]: 'read',
      },
      '/admin/roles': {
        [RoleEnum.ADMINISTRADOR]: 'read|update|create|delete',
        [RoleEnum.GERENTE]: 'read',
      },
      '/admin/parameters': {
        [RoleEnum.ADMINISTRADOR]: 'read|update|create|delete',
        [RoleEnum.GERENTE]: 'read|update|create|delete',
      },
      '/admin/policies': {
        [RoleEnum.ADMINISTRADOR]: 'read|update|create|delete',
        [RoleEnum.GERENTE]: 'read',
      },
      '/admin/modules': {
        [RoleEnum.ADMINISTRADOR]: 'read|update|create|delete',
        [RoleEnum.GERENTE]: 'read',
      },
      '/admin/plantillas': {
        [RoleEnum.GERENTE]: 'read|update|create|delete',
      },
      '/admin/controles': {
        [RoleEnum.GERENTE]: 'read|update|create|delete',
      },
    }

    const backendRoutes: CasbinValue = {
      //crud de Usuarios
      '/api/users': {
        [RoleEnum.ADMINISTRADOR]: 'GET|POST',
        [RoleEnum.GERENTE]: 'GET|POST',
      },
      '/api/users/:id': {
        [RoleEnum.ADMINISTRADOR]: 'PATCH|GET|DELETE',
        [RoleEnum.GERENTE]: 'PATCH|GET|DELETE',
      },
      '/api/users/:id/change-status': {
        [RoleEnum.ADMINISTRADOR]: 'PATCH',
        [RoleEnum.GERENTE]: 'PATCH',
      },
      '/api/users/:id/update-profile': {
        [RoleEnum.ADMINISTRADOR]: 'PATCH',
        [RoleEnum.GERENTE]: 'PATCH',
      },
      '/api/users/:id/change-password': {
        [RoleEnum.ADMINISTRADOR]: 'PATCH',
        [RoleEnum.GERENTE]: 'PATCH',
      },
      //crud de Roles
      '/api/roles': {
        [RoleEnum.ADMINISTRADOR]: 'GET|POST',
        [RoleEnum.GERENTE]: 'GET',
      },
      '/api/roles/:id': {
        [RoleEnum.ADMINISTRADOR]: 'GET|PATCH|DELETE',
        [RoleEnum.GERENTE]: 'GET|PATCH|DELETE',
      },
      '/api/roles/:id/change-status': {
        [RoleEnum.ADMINISTRADOR]: 'PATCH',
        [RoleEnum.GERENTE]: 'PATCH',
      },
      //Crud de Parametros
      '/api/parameters': {
        [RoleEnum.ADMINISTRADOR]: 'GET|POST',
        [RoleEnum.GERENTE]: 'GET',
      },
      '/api/parameters/:id:': {
        [RoleEnum.ADMINISTRADOR]: 'PATCH|GET|DELETE',
        [RoleEnum.CLIENTE]: 'PATCH',
      },
      '/api/parameters/:id/change-status': {
        [RoleEnum.ADMINISTRADOR]: 'PATCH',
        [RoleEnum.GERENTE]: 'PATCH',
      },
      '/api/parameters/:group/list': {
        [RoleEnum.ADMINISTRADOR]: 'GET',
        [RoleEnum.GERENTE]: 'GET',
      },
      //Crud de Politicas
      '/api/policies': {
        [RoleEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
        [RoleEnum.GERENTE]: 'GET',
      },
      '/api/policies/authorization': {
        [RoleEnum.ADMINISTRADOR]: 'POST',
        [RoleEnum.GERENTE]: 'POST',
      },
      '/api/policies/status': {
        [RoleEnum.ADMINISTRADOR]: 'PATCH',
      },
      //modules
      '/api/modules': {
        [RoleEnum.ADMINISTRADOR]: 'POST|GET|PATCH',
      },
      '/api/modules/:id': {
        [RoleEnum.ADMINISTRADOR]: 'PATCH|GET|DELETE',
      },
      '/api/modules/:id/status': {
        [RoleEnum.ADMINISTRADOR]: 'PATCH|GET',
      },
      '/api/modules/change/order': {
        [RoleEnum.ADMINISTRADOR]: 'PATCH',
      },
    }

    const registrarCasbin = async (
      valoresCasbin: CasbinValue,
      tipo: string,
    ) => {
      for (const routePath of Object.keys(valoresCasbin)) {
        const rolNameList = Object.keys(valoresCasbin[routePath])
        for (const rolName of rolNameList) {
          const action = valoresCasbin[routePath][rolName]
          const datosRegistro = new CasbinRule({
            ptype: 'p',
            v0: rolName,
            v1: routePath,
            v2: action,
            v3: tipo,
            v4: 'ACTIVO',
          })
          await queryRunner.manager.save(datosRegistro)
        }
      }
    }

    await registrarCasbin(frontendRoutes, 'frontend')
    await registrarCasbin(backendRoutes, 'backend')
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
export type RouteItem = {
  [key: string]: string
}

export type CasbinValue = {
  [key: string]: RouteItem
}
