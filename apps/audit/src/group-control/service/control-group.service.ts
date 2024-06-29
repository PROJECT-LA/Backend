import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import {
  CreateControlGroupDto,
  FilterControlGroupDto,
  STATUS,
  UpdateControlGroupDto,
} from '@app/common'
import { IControlGroupRepository } from '../interface'
import { RpcException } from '@nestjs/microservices'
import { ITemplateRepository } from '../../template/interface'
import { Equal, FindManyOptions, Like, UpdateResult } from 'typeorm'
import { Control } from '../../control/entities'
import { ControlGroup } from '../entities'

@Injectable()
export class ControlGroupService {
  /**
   * Constructor del servicio ControlGroupService.
   *
   * Inyecta las dependencias necesarias para el servicio, incluyendo los repositorios
   * para grupos de control y plantillas.
   *
   * @param {IControlGroupRepository} controlRepository - Repositorio para operaciones
   *                                                      relacionadas con grupos de control.
   * @param {ITemplateRepository} templateRepository - Repositorio para operaciones
   *                                                   relacionadas con plantillas.
   */
  constructor(
    @Inject('IControlGroupRepository')
    private controlRepository: IControlGroupRepository,
    @Inject('ITemplateRepository')
    private templateRepository: ITemplateRepository,
  ) {}

  /**
   * Obtiene un ControlGroup por su ID.
   *
   * Este método busca un ControlGroup específico por su ID utilizando el repositorio
   * de control. Si el ControlGroup con el ID proporcionado no se encuentra, se lanza
   * una excepción `RpcException` con un mensaje 'Control no encontrado'.
   *
   * @param {string} id - El ID del ControlGroup a buscar.
   * @returns {Promise<ControlGroup>} Una promesa que se resuelve con el ControlGroup encontrado.
   * @throws {RpcException} Si no se encuentra el ControlGroup con el ID proporcionado.
   */
  async getControlGroupById(id: string): Promise<ControlGroup> {
    const controlGroup = await this.controlRepository.findOneByCondition({
      where: { id },
    })
    if (!controlGroup)
      throw new RpcException(new NotFoundException('Control no encontrado'))
    return controlGroup
  }

  /**
   * Lista los ControlGroups aplicando paginación y filtrado.
   *
   * Este método recibe un objeto `paginationQueryDto` que contiene los parámetros
   * para la paginación (`skip`, `limit`) y el filtrado (`filter`, `idTemplate`).
   * Utiliza estos parámetros para construir un conjunto de opciones que se pasan
   * a la consulta de la base de datos para filtrar y paginar los resultados.
   *
   * Los ControlGroups se filtran por `idTemplate` y por coincidencias parciales
   * en los campos `objective` y `group` con el valor proporcionado en `filter`.
   * Además, se establece la relación `controls` para ser incluida en los resultados.
   *
   * @param {FilterControlGroupDto} paginationQueryDto - Objeto que contiene los parámetros
   *                                                     de paginación y filtrado.
   * @returns {Promise<ControlGroup[]>} Una promesa que se resuelve con la lista de ControlGroups
   *                                    que coinciden con los criterios de búsqueda, paginación
   *                                    y filtrado aplicados.
   */
  async list(
    paginationQueryDto: FilterControlGroupDto,
  ): Promise<[ControlGroup[], number]> {
    const { skip, limit, filter, idTemplate } = paginationQueryDto
    const options: FindManyOptions<ControlGroup> = {
      where: [
        {
          idTemplate: Equal(idTemplate),
          objective: Like(`%${filter}%`),
        },
        {
          idTemplate: Equal(idTemplate),
          group: Like(`%${filter}%`),
        },
      ],
      relations: {
        controls: true,
      },
      skip,
      take: limit,
    }
    return await this.controlRepository.getPaginateItems(options)
  }

  /**
   * Crea un nuevo ControlGroup basado en los datos proporcionados.
   *
   * Este método intenta crear un nuevo ControlGroup utilizando los datos proporcionados
   * en `controlDto`. Antes de crear el ControlGroup, verifica si la plantilla especificada
   * en `controlDto.idTemplate` existe. Si la plantilla no existe, se lanza una excepción
   * `RpcException` con un mensaje de error 'Plantilla no encontrada'.
   *
   * Si la plantilla existe, se procede a crear el ControlGroup con los datos proporcionados
   * y luego se guarda en la base de datos. El método devuelve el ControlGroup guardado.
   *
   * @param {CreateControlGroupDto} controlDto - Un objeto DTO que contiene los datos
   *                                             necesarios para crear el ControlGroup.
   * @returns {Promise<ControlGroup>} Una promesa que se resuelve con el ControlGroup creado.
   * @throws {RpcException} Si la plantilla especificada no se encuentra.
   */
  async create(controlDto: CreateControlGroupDto): Promise<ControlGroup> {
    const template = await this.templateRepository.findOneById(
      controlDto.idTemplate,
    )
    if (!template)
      throw new RpcException(new NotFoundException('Plantilla no encontrada'))

    const newControlGroup = this.controlRepository.create(controlDto)
    return await this.controlRepository.save(newControlGroup)
  }

  /**
   * Actualiza un ControlGroup existente con los datos proporcionados.
   *
   * Este método primero verifica la existencia del ControlGroup especificado por el ID.
   * Si el ControlGroup existe, procede a actualizarlo con los datos proporcionados en
   * `controlDto`. La actualización se realiza mediante el repositorio de ControlGroup,
   * asegurando que solo se actualicen los campos especificados en `controlDto`.
   *
   * @param {string} id - El ID del ControlGroup a actualizar.
   * @param {UpdateControlGroupDto} controlDto - Un objeto DTO que contiene los campos
   *                                             a actualizar en el ControlGroup.
   * @returns {Promise<UpdateResult>} Una promesa que se resuelve con el resultado de la
   *                                  operación de actualización.
   */
  async update(
    id: string,
    controlDto: UpdateControlGroupDto,
  ): Promise<UpdateResult> {
    await this.getControlGroupById(id)
    return await this.controlRepository.update(id, controlDto)
  }

  /**
   * Elimina un ControlGroup y todos los Controles asociados.
   *
   * Este método primero verifica la existencia del ControlGroup especificado por el ID.
   * Si el ControlGroup existe, procede a eliminar todos los Controles asociados a este
   * ControlGroup y luego elimina el propio ControlGroup.
   *
   * La eliminación se realiza dentro de una transacción para asegurar la consistencia
   * de la base de datos. Si alguna de las operaciones de eliminación falla, la transacción
   * se revertirá para evitar estados inconsistentes.
   *
   * @param {string} id - El ID del ControlGroup a eliminar.
   * @returns {Promise<void>} Una promesa que se resuelve una vez que el ControlGroup
   *                          y todos sus Controles asociados han sido eliminados.
   */
  async delete(id: string): Promise<void> {
    await this.getControlGroupById(id)
    await this.controlRepository.transactional(async (manager) => {
      await manager.delete(Control, { idControlGroup: id })
      await manager.delete(ControlGroup, { id: id })
    })
  }

  /**
   * Cambia el estado de un ControlGroup y todos sus Controles asociados.
   * Si el estado actual es ACTIVO, lo cambia a INACTIVO, y viceversa.
   * @param {string} id - El ID del ControlGroup a actualizar.
   * @returns Una promesa que se resuelve una vez que la transacción se completa.
   */
  async changeStatus(id: string): Promise<void> {
    const controlGroup = await this.getControlGroupById(id)

    const newStatus =
      controlGroup.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE

    return await this.controlRepository.transactional(async (manager) => {
      await manager.update(ControlGroup, id, {
        status: newStatus,
      })
      await manager.update(Control, id, {
        status: newStatus,
      })
    })
  }
}
