import { STATUS } from 'src/common/constants'
import { RoleEnum } from 'src/core/authorization/constants'
import { CasbinRule } from 'src/core/authorization/entitites/casbin.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class CasbinRules1714370182567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const frontendRoutes: CasbinValue = {
      '/admin/users': {
        [RoleEnum.ADMINISTRADOR]: 'read|update|create|delete',
        [RoleEnum.GERENTE]: 'read',
      },
      '/admin/roles': {
        [RoleEnum.ADMINISTRADOR]: 'read|update|create',
        [RoleEnum.GERENTE]: 'read',
      },
    }

    const backendRoutes: CasbinValue = {
      '/api/users': {
        [RoleEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
      },
      '/api/roles': {
        [RoleEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
        [RoleEnum.GERENTE]: 'GET',
      },
      '/api/users/:id': {
        [RoleEnum.ADMINISTRADOR]: 'GET|POST|DELETE|PATCH',
      },
      '/api/roles/:id': {
        [RoleEnum.CLIENTE]: 'PATCH',
      },
    }

    const registrarCasbin = async (
      valoresCasbin: CasbinValue,
      tipo: string
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
