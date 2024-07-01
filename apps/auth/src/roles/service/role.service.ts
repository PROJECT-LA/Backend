import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common'
import {
  CreateRoleDto,
  FilterRoleDto,
  STATUS,
  UpdateRoleDto,
} from '@app/common'
import { IRoleRepository } from '../interface/iRole-repository'
import { PolicyService } from '../../policies/service'
import { RpcException } from '@nestjs/microservices'
import { DeleteResult, FindManyOptions, Like, UpdateResult } from 'typeorm'
import { Role } from '../entities'

@Injectable()
export class RoleService {
  constructor(
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
    private readonly policyService: PolicyService,
  ) {}

  /**
   * Recupera un rol por su ID.
   *
   * @description
   * Este método asincrónico busca un rol específico por su ID utilizando `roleRepository`.
   * Si el rol existe, lo devuelve. Si el rol no se encuentra, lanza una excepción.
   *
   * @param {string} id - El ID del rol que se desea recuperar.
   * @returns {Promise<Role>} Una promesa que resuelve con el rol encontrado.
   *
   * @throws {RpcException} Lanza una excepción de tipo `RpcException` que encapsula una
   * `NotFoundException` con el mensaje 'Rol no encontrado', en caso de que el rol no exista.
   */
  async getRoleById(id: string): Promise<Role> {
    const role = await this.roleRepository.findOneById(id)
    if (!role)
      throw new RpcException(new NotFoundException('Rol no encontrado'))
    return role
  }

  /**
   * Crea un nuevo rol en la base de datos.
   *
   * @description
   * Este método asincrónico primero valida el nombre del rol para asegurarse de que no exista
   * un rol con el mismo nombre. Luego, crea una nueva instancia de rol utilizando los datos
   * proporcionados en `createRoleDto` y la guarda en la base de datos.
   * La validación del nombre del rol se realiza mediante el método `validateRole`, que lanza una excepción
   * si el nombre ya está en uso. Si la validación es exitosa, se procede a crear y guardar el nuevo rol.
   *
   * @param {CreateRoleDto} createRoleDto - Objeto DTO que contiene la información necesaria para crear un nuevo rol.
   * @returns {Promise<Role>} Una promesa que resuelve con el rol recién creado.
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    await this.validateRole(createRoleDto.name)
    const newRole = this.roleRepository.create(createRoleDto)
    return await this.roleRepository.save(newRole)
  }

  /**
   * Actualiza un rol existente en la base de datos.
   *
   * @description
   * Este método asincrónico primero valida el nombre del rol para asegurarse de que no exista
   * otro rol con el mismo nombre (excluyendo el rol actualmente en actualización). Si la validación
   * es exitosa, procede a actualizar el rol con los datos proporcionados en `updateRoleDto`.
   *
   * @param {string} id - El ID del rol que se desea actualizar.
   * @param {UpdateRoleDto} updateRoleDto - Objeto DTO que contiene la información actualizada para el rol.
   * @returns {Promise<UpdateResult>} Una promesa que resuelve con el resultado de la operación de actualización.
   */
  async updateRole(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<UpdateResult> {
    await this.validateRole(updateRoleDto.name, id)
    return await this.roleRepository.update(id, updateRoleDto)
  }

  /**
   * Elimina un rol de la base de datos.
   *
   * @description
   * Este método asincrónico primero verifica la existencia del rol utilizando el método `getRoleById`.
   * Si el rol existe, procede a eliminarlo de la base de datos utilizando el método `delete` del `roleRepository`.
   *
   * Antes de proceder con la eliminación, se realiza una comprobación de existencia para asegurar que el rol
   * a eliminar efectivamente existe. Esto evita intentar eliminar un rol que no existe y permite manejar
   * adecuadamente dicha situación, lanzando una excepción si el rol no se encuentra.
   *
   * @param {string} id - El ID del rol que se desea eliminar.
   * @returns {Promise<DeleteResult>} Una promesa que resuelve con el resultado de la operación de eliminación.
   */
  async deleteRole(id: string): Promise<DeleteResult> {
    await this.getRoleById(id)
    return await this.roleRepository.delete(id)
  }

  /**
   * Valida si un nombre de rol ya está registrado en la base de datos y si es único.
   *
   * @description
   * Este método asincrónico realiza dos comprobaciones principales:
   * 1. Si se proporciona un `idRole`, verifica que el rol exista llamando a `getRoleById`.
   * 2. Verifica si ya existe un rol con el mismo nombre proporcionado en el parámetro `name`.
   *
   * Si se encuentra un rol con el mismo nombre y:
   * - No se proporcionó `idRole`, o
   * - El `id` del rol encontrado es diferente al `idRole` proporcionado,
   * entonces se considera que el nombre del rol no es único y se lanza una excepción.
   *
   * @param {string} name - El nombre del rol a validar.
   * @param {string} [idRole] - El ID del rol que se está actualizando (opcional).
   * @throws {RpcException} - Lanza una excepción si el nombre del rol ya está registrado.
   */
  async validateRole(name: string, idRole?: string) {
    if (idRole) {
      await this.getRoleById(idRole)
    }
    const role = await this.roleRepository.findOneByCondition({
      where: { name },
    })
    if (role && (idRole === undefined || role.id !== idRole)) {
      throw new RpcException(
        new ConflictException('El nombre del rol ya se encuentra registrado'),
      )
    }
  }

  /**
   * Lista los roles según los criterios de paginación y filtrado especificados.
   *
   * @description
   * Este método asincrónico recupera una lista paginada de roles de la base de datos,
   * aplicando un filtro opcional sobre los campos `name` y `description` de los roles.
   * La paginación se controla mediante los parámetros `skip` y `limit`.
   * Los roles se filtran buscando coincidencias parciales en los campos `name` y `description`,
   * utilizando el valor proporcionado en `filter`. La búsqueda es insensible a mayúsculas y minúsculas.
   * Los resultados se ordenan por el ID del rol en orden ascendente.
   *
   * @param {FilterRoleDto} paginationQueryDto - Objeto DTO que contiene los parámetros de paginación y filtrado.
   * @returns {Promise<[Role[],number>]} Una promesa que resuelve con la lista paginada de roles e infromacion de la paginación.
   */
  async list(paginationQueryDto: FilterRoleDto): Promise<[Role[], number]> {
    const { skip, limit, filter } = paginationQueryDto
    const options: FindManyOptions<Role> = {
      where: [
        {
          name: Like(`%${filter}%`),
        },
        {
          description: Like(`%${filter}%`),
        },
      ],
      skip,
      take: limit,
      order: { id: 'ASC' },
    }
    return await this.roleRepository.getPaginateItems(options)
  }

  /**
   * Cambia el estado de un rol específico.
   *
   * @description
   * Este método cambia el estado de un rol basado en su ID. Si el rol está activo,
   * se cambia a inactivo, y viceversa. Realiza la actualización a través de `roleRepository`
   * y luego aplica los cambios de estado necesarios en las políticas asociadas al rol mediante `policyService`.
   *
   * @param {string} idRole - El ID del rol cuyo estado se desea cambiar.
   * @returns {Promise<{id: string, status: string}>} Un objeto que contiene el ID del rol y su nuevo estado.
   *
   * @throws {RpcException} Lanza una excepción si no se puede cambiar el estado del rol, encapsulando
   * una `PreconditionFailedException` con un mensaje específico.
   */
  async changeRoleState(
    idRole: string,
  ): Promise<{ id: string; status: string }> {
    const role = await this.getRoleById(idRole)
    const newStatus =
      role.status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    try {
      await this.roleRepository.update(idRole, { status: newStatus })
      await this.policyService.changePoliciesByRoleState(idRole, newStatus)
    } catch (error) {
      throw new RpcException(
        new PreconditionFailedException('No se pudo cambiar el estado del rol'),
      )
    }
    return {
      id: idRole,
      status: newStatus,
    }
  }
}
