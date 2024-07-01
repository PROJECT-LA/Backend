import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateModuleDto,
  NewOrderDto,
  UpdateModuleDto,
  STATUS,
} from '@app/common'
import { ModuleEntity } from '../entities'
import { RpcException } from '@nestjs/microservices'
import { Equal, IsNull, UpdateResult } from 'typeorm'
import { IModuleRepository } from '../interface'

@Injectable()
export class ModuleService {
  constructor(
    @Inject('IModuleRepository')
    private readonly moduleRepository: IModuleRepository,
  ) {}

  /**
   * Obtiene un módulo por su ID, incluyendo sus submódulos relacionados.
   *
   * @description
   * Este método asincrónico busca un módulo específico por su ID en la base de datos. Además,
   * incluye en la búsqueda los submódulos relacionados al módulo principal gracias a la opción
   * `relations`. Si el módulo no se encuentra, se lanza una excepción indicando que el módulo
   * no fue encontrado.
   *
   * @param {string} id - El ID del módulo que se desea obtener.
   * @returns {Promise<Module>} Una promesa que resuelve con el módulo encontrado, incluyendo sus submódulos.
   * @throws {RpcException} - Lanza una excepción si el módulo con el ID especificado no existe.
   */
  async getModuleById(id: string): Promise<ModuleEntity> {
    const module = await this.moduleRepository.findOneByCondition({
      where: { id },
      relations: {
        subModule: true,
      },
    })
    if (!module) {
      throw new RpcException(new NotFoundException('Modulo no encontrado'))
    }
    return module
  }

  /**
   * Crea un nuevo módulo basado en los datos proporcionados en `moduleDto`.
   *
   * @description
   * Este método asume que `moduleDto` es una instancia de `CreateModuleDto`, la cual contiene
   * los datos necesarios para crear un nuevo módulo. El proceso de creación varía dependiendo
   * de si `moduleDto` incluye un `idModule` o no.
   *
   * Si `moduleDto` incluye un `idModule`, el método realiza los siguientes pasos:
   * 1. Crea un nuevo módulo (`newModule`) con los datos de `moduleDto`.
   * 2. Crea un objeto `module` solo con el `id` especificado en `idModule`.
   * 3. Obtiene el orden actual de los módulos dentro de la sección especificada por `idModule`
   *    mediante `getModulesOrderBySection`.
   * 4. Establece el orden de `newModule` al siguiente número después del último orden encontrado.
   * 5. Asigna el objeto `module` creado a `newModule.module`.
   *
   * Si `moduleDto` no incluye un `idModule` pero sí un `idRole`, el método:
   * 1. Crea un nuevo módulo (`newModule`) con los datos de `moduleDto`.
   * 2. Obtiene el orden actual de las secciones asociadas al rol especificado por `idRole`
   *    mediante `getSectionOrderByRole`.
   * 3. Establece el orden de `newModule` al siguiente número después del último orden encontrado.
   *
   * Finalmente, guarda el `newModule` en la base de datos mediante `moduleRepository.save` y devuelve
   * el módulo guardado.
   *
   * @param {CreateModuleDto} moduleDto - Objeto que contiene los datos necesarios para crear un nuevo módulo.
   * @returns {Promise<ModuleEntity>} Una promesa que resuelve al módulo recién creado y guardado.
   */
  async create(moduleDto: CreateModuleDto): Promise<ModuleEntity> {
    const newModule = this.moduleRepository.create(moduleDto)
    if (moduleDto.idModule) {
      const module = this.moduleRepository.create({
        id: moduleDto.idModule,
      })
      const order = await this.getModulesOrderBySection(moduleDto.idModule)
      newModule.order = order + 1
      newModule.module = module
    } else {
      const order = await this.getSectionOrderByRole(moduleDto.idRole)
      newModule.order = order + 1
    }
    return await this.moduleRepository.save(newModule)
  }

  /**
   * Actualiza un módulo existente identificado por `id` con los datos proporcionados en `moduleDto`.
   *
   * @description
   * Este método primero verifica la existencia del módulo mediante `getModuleById(id)`. Si el módulo
   * existe, procede a actualizarlo con los datos proporcionados en `moduleDto`, que es una instancia
   * de `UpdateModuleDto`. `UpdateModuleDto` contiene los campos que pueden ser actualizados en el módulo.
   *
   * La actualización se realiza a través de `moduleRepository.update`, pasando el `id` del módulo y
   * `moduleDto` como argumentos. Este método devuelve el resultado de la operación de actualización.
   *
   * @param {string} id - El identificador único del módulo a actualizar.
   * @param {UpdateModuleDto} moduleDto - Objeto que contiene los datos actualizados para el módulo.
   * @returns {Promise<UpdateResult>} Una promesa que resuelve al resultado de la operación de actualización.
   */
  async update(id: string, moduleDto: UpdateModuleDto): Promise<UpdateResult> {
    await this.getModuleById(id)
    return await this.moduleRepository.update(id, moduleDto)
  }

  async delete(id: string) {
    await this.getModuleById(id)
    return await this.moduleRepository.transactional(async (manager) => {
      await manager.delete(ModuleEntity, { idModule: id })
      await manager.delete(ModuleEntity, id)
    })
  }

  async changeStatus(id: string) {
    const module = await this.moduleRepository.findOneByCondition({
      where: { id },
      relations: ['subModule'],
    })
    module.status =
      module.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    if (module.subModule) {
      module.subModule.forEach((subModule) => {
        subModule.status = module.status
      })
    }
    return await this.moduleRepository.save(module)
  }

  async updateOrder(newOrder: NewOrderDto) {
    const { data } = newOrder
    const updatedModules: ModuleEntity[] = []

    for (const moduleData of data) {
      const module = await this.moduleRepository.preload({
        id: moduleData.id,
      })
      if (module) {
        module.subModule = []
        if (moduleData.subModules) {
          for (const subModuleData of moduleData.subModules) {
            const existingSubModule = await this.moduleRepository.preload({
              id: subModuleData.id,
            })
            if (existingSubModule) {
              existingSubModule.order = parseInt(subModuleData.order)
              module.subModule.push(existingSubModule)
            }
          }
        }
        module.order = parseInt(moduleData.order)
        updatedModules.push(module)
      }
    }
    await this.moduleRepository.saveMany(updatedModules)
  }

  async getModulesByRole(id: string) {
    const res = await this.moduleRepository.findManyByConditions({
      where: {
        idRole: id,
        idModule: IsNull(),
      },
      select: {
        module: {
          id: true,
          title: true,
          description: true,
          status: true,
          order: true,
          idRole: true,
          subModule: {
            id: true,
            title: true,
            url: true,
            order: true,
            icon: true,
            status: true,
            idRole: true,
          },
        },
      },
      relations: { subModule: true },
      order: { order: 'ASC', subModule: { order: 'ASC' } },
    })
    console.log(res)
    return res
  }

  async getSectionOrderByRole(id: string) {
    const result = await this.moduleRepository.findOneByCondition({
      where: {
        module: {
          idRole: id,
          module: Equal(null),
        },
      },
      order: { order: 'DESC' },
    })
    return result ? result.order : 0
  }

  async getModulesOrderBySection(id: string) {
    const result = await this.moduleRepository.findOneByCondition({
      where: {
        module: {
          idModule: id,
        },
      },
      order: { order: 'DESC' },
    })
    return result ? result.order : 0
  }
}
