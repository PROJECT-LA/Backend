import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
  Query,
} from '@nestjs/common'
import { AuthZManagementService } from 'nest-authz'
import {
  APP,
  CreatePolicyDto,
  FilterPoliciesDto,
  PassportUser,
  STATUS,
} from '@app/common'
import { IRoleRepository } from '../../roles/interface'
import { RpcException } from '@nestjs/microservices'

type politicasResultType = [Array<CreatePolicyDto>, number]

@Injectable()
export class PolicyService {
  constructor(
    private readonly authZManagerService: AuthZManagementService,
    @Inject('IRoleRepository')
    private readonly roleRepository: IRoleRepository,
  ) {}

  /**
   * Encuentra todas las políticas aplicando filtros de paginación y búsqueda.
   *
   * @param {FilterPoliciesDto} paginationQueryDto - DTO que contiene los parámetros de paginación y filtros.
   * @returns {Promise<politicasResultType>} Una promesa que resuelve a un arreglo que contiene las políticas filtradas y el total de políticas.
   *
   * @description
   * Este método recupera todas las políticas de acceso y las filtra según los criterios especificados en `paginationQueryDto`.
   * Los filtros aplicables incluyen limitación de resultados, paginación, y búsqueda por texto en campos específicos de la política.
   *
   * - `limit` y `page` permiten paginar los resultados.
   * - `filter` aplica un filtro de búsqueda que compara el texto con varios campos de la política.
   * - `aplication` filtra las políticas por la aplicación específica.
   *
   * Además, se entremesclan los resultados con el nombre del sujeto (rol) obtenido de `roleRepository`.
   *
   * Si `limit` o `page` no están definidos, se retornan todos los resultados sin paginar.
   */
  async findAll(
    @Query() paginationQueryDto: FilterPoliciesDto,
  ): Promise<politicasResultType> {
    const { limit, page, filter, aplication } = paginationQueryDto
    const roles = await this.roleRepository.findAll({
      select: {
        id: true,
        name: true,
      },
    })

    const policy = await this.authZManagerService.getPolicy()

    let result = policy.map((policy) => ({
      subject: policy[0],
      object: policy[1],
      action: policy[2],
      app: policy[3],
      status: policy[4],
      subjectName:
        roles.find((role) => role.id === policy[0])?.name || 'SIN ROL',
    }))

    if (filter) {
      result = result.filter(
        (r) =>
          r.object.toLowerCase().includes(filter.toLowerCase()) ||
          r.action.toLowerCase().includes(filter.toLowerCase()) ||
          r.app.toLowerCase().includes(filter.toLowerCase()) ||
          r.subjectName.toLowerCase().includes(filter.toLowerCase()),
      )
    }

    if (aplication) {
      result = result.filter((r) =>
        r.app.toLowerCase().includes(aplication.toLowerCase()),
      )
    }

    if (!limit || !page) {
      return [result, result.length]
    }
    const i = limit * (page - 1)
    const f = limit * page

    const subset = result.slice(i, f)
    return [subset, result.length]
  }

  /**
   * Crea una nueva política de acceso en el sistema.
   *
   * @param {CreatePolicyDto} policy - DTO que contiene los datos de la nueva política a crear.
   * @returns {Promise<CreatePolicyDto>} Una promesa que resuelve al DTO de la política creada.
   *
   * @description
   * Este método intenta crear una nueva política de acceso utilizando los datos proporcionados en `policy`.
   *
   * Los pasos para la creación de la política son los siguientes:
   * 1. Extrae los campos `subject`, `object`, `action`, y `app` del DTO `policy`.
   * 2. Consulta la existencia del `subject` (rol) en el repositorio de roles.
   *    - Si el rol no existe, lanza una excepción `RpcException` con un mensaje indicando que el rol no se encontró.
   * 3. Busca si existe una politixa con el mismo subject, object y app.
   *    - Si existe, lanza una excepción `RpcException` con un mensaje indicando que la política ya se encuentra registrada.
   * 4. Invoca al servicio `authZManagerService.addPolicy` para añadir la nueva política al sistema, marcándola como activa.
   * 5. Retorna el DTO de la política creada.
   *
   * @throws {RpcException} - Lanza una excepción si el rol especificado en `subject` no existe.
   *
   */
  async createPolicie(policy: CreatePolicyDto): Promise<CreatePolicyDto> {
    const { subject, object, action, app } = policy
    const role = await this.roleRepository.findOneById(subject)
    if (!role) {
      throw new RpcException(
        new NotFoundException('El rol especificado no se encontro'),
      )
    }

    const policies = await this.authZManagerService.getPolicy()
    const result = policies.map((item) => ({
      subject: item[0],
      object: item[1],
      action: item[2],
      app: item[3],
      status: item[4],
    }))

    const exists = result.find(
      (politic) =>
        politic.subject === policy.subject &&
        politic.object === policy.object &&
        politic.app === policy.app,
    )
    if (exists) {
      throw new RpcException(
        new PreconditionFailedException(
          'La politica ya se encuentra registrada',
        ),
      )
    }

    try {
      await this.authZManagerService.addPolicy(
        subject,
        object,
        action,
        app,
        STATUS.ACTIVE,
      )
    } catch {
      throw new RpcException(
        new PreconditionFailedException('Ocurrio un error al crear politica'),
      )
    }
    return policy
  }

  /**
   * Actualiza una política existente en el sistema.
   *
   * @param {CreatePolicyDto} policy - DTO que contiene los datos de la política a actualizar.
   * @param {CreatePolicyDto} newPolicie - DTO que contiene los nuevos datos para la política.
   * @returns {Promise<void>} Una promesa que se resuelve cuando la política ha sido actualizada.
   *
   * @description
   * Este método actualiza una política existente, identificada por los datos en `policy`, con los nuevos valores proporcionados en `newPolicie`.
   *
   * Los pasos para la actualización de la política son los siguientes:
   * 1. Extrae los campos `subject`, `object`, `action`, `app`, y `status` del DTO `newPolicie`.
   * 2. Verifica la existencia del `subject` (rol) en el repositorio de roles.
   *    - Si el rol no existe, lanza una excepción `RpcException` con un mensaje indicando que el rol no se encontró.
   * 3. Elimina la política existente utilizando el método `deletePolicie`.
   * 4. Añade la nueva política al sistema con los datos proporcionados en `newPolicie`, utilizando el método `addPolicy` del servicio `authZManagerService`.
   *
   * @throws {RpcException} - Lanza una excepción si el rol especificado en `subject` no existe.
   *
   */
  async updatePolicie(
    policy: CreatePolicyDto,
    newPolicie: CreatePolicyDto,
  ): Promise<CreatePolicyDto> {
    try {
      const { subject, object, action, app, status } = newPolicie
      const role = await this.roleRepository.findOneById(subject)
      if (!role) {
        throw new RpcException(
          new NotFoundException('No se encontro el rol especificado'),
        )
      }
      await this.deletePolicie(policy)
      await this.authZManagerService.addPolicy(
        subject,
        object,
        action,
        app,
        status,
      )
      return newPolicie
    } catch (e) {
      console.log(e)
      throw new RpcException(
        new PreconditionFailedException(
          'Ocurrio un error al actualizar politica',
        ),
      )
    }
  }

  /**
   * Elimina una política específica del sistema de control de acceso.
   *
   * @param {CreatePolicyDto} policy - DTO que contiene los criterios para identificar la política a eliminar.
   * @returns {Promise<CreatePolicyDto>} Una promesa que resuelve al DTO de la política eliminada.
   *
   * @description
   * Este método intenta eliminar una política específica basada en los criterios proporcionados en el objeto `policy`. Los criterios incluyen `subject`, `object`, `action`, `app`, y `status`.
   *
   * El proceso comienza verificando la existencia de la política especificada mediante el método `getPolicie`. Si la política existe, procede a intentar eliminarla utilizando el método `removePolicy` del servicio `authZManagerService`.
   *
   * Si la eliminación es exitosa, devuelve el DTO de la política que fue eliminada. En caso de que ocurra un error durante el proceso de eliminación, se captura la excepción y se lanza una `RpcException` con una `PreconditionFailedException`, indicando que ocurrió un error al eliminar la política.
   *
   * @throws {RpcException} - Se lanza si ocurre un error al intentar eliminar la política.
   *
   */
  async deletePolicie(policy: CreatePolicyDto): Promise<CreatePolicyDto> {
    const { subject, object, action, app, status } = policy
    await this.getPolicie(policy)
    try {
      await this.authZManagerService.removePolicy(
        subject,
        object,
        action,
        app,
        status,
      )
    } catch {
      throw new RpcException(
        new PreconditionFailedException(
          'Ocurrio un error al eliminar politica',
        ),
      )
    }
    return policy
  }

  /**
   * Busca y devuelve una política específica basada en los criterios proporcionados.
   *
   * @param {CreatePolicyDto} policy - Un objeto que contiene los criterios para buscar la política.
   * @returns {Promise<CreatePolicyDto>} Una promesa que resuelve al objeto de la política encontrada.
   *
   * @description
   * Este método intenta encontrar una política específica que coincida con los criterios proporcionados en el objeto `policy`. Los criterios de búsqueda incluyen `subject`, `object`, `action`, y `app`.
   *
   * El proceso comienza obteniendo todas las políticas disponibles a través de `authZManagerService.getPolicy()`. Luego, transforma cada política en un objeto con las propiedades `subject`, `object`, `action`, `app`, y `status`.
   *
   * Después, realiza una búsqueda en la lista de políticas transformadas para encontrar una que coincida con todos los criterios especificados en `policy`. Si una política coincidente es encontrada, se devuelve como resultado.
   *
   * En caso de que no se encuentre una política que coincida con los criterios, se lanza una excepción `RpcException` con un `NotFoundException`, indicando que la política solicitada no se pudo encontrar.
   *
   *
   * @throws {RpcException} - Se lanza si la política especificada no se encuentra.
   *
   */
  async getPolicie(policy: CreatePolicyDto): Promise<CreatePolicyDto> {
    const policies = await this.authZManagerService.getPolicy()
    const result = policies.map((item) => ({
      subject: item[0],
      object: item[1],
      action: item[2],
      app: item[3],
      status: item[4],
    }))

    const exists = result.find(
      (politic) =>
        politic.subject === policy.subject &&
        politic.object === policy.object &&
        politic.action === policy.action &&
        politic.app === policy.app,
    )
    if (!exists) {
      throw new RpcException(
        new NotFoundException('No se encontro la politica'),
      )
    }
    return exists
  }

  /**
   * Cambia el estado de una política específica.
   *
   * @param {CreatePolicyDto} policyDto - DTO que contiene los criterios para identificar la política a cambiar.
   * @returns {Promise<any>} Una promesa que resuelve al resultado de agregar la política con el estado cambiado.
   *
   * @description
   * Este método permite cambiar el estado de una política específica. Los estados posibles son `ACTIVO` e `INACTIVO`.
   *
   * El proceso se realiza en dos pasos principales:
   * 1. Elimina la política existente que coincide con los criterios especificados en `policyDto`. Esto se hace mediante el método `deletePolicie`, metodo para buscar y eliminar la política basada en los criterios proporcionados.
   * 2. Agrega una nueva política con los mismos criterios (`subject`, `object`, `action`, `app`) pero con el estado opuesto. Si el estado actual es `ACTIVO`, se cambia a `INACTIVO`, y viceversa.
   *
   * Este enfoque es en base al funcionamiento de casbin el cual solo permite adicionar o eliminar polticas.
   *
   * @throws {Error} - Puede lanzar errores si la eliminación o adición de la política falla.
   *
   */
  async changeStatusPolicy(policy: CreatePolicyDto): Promise<CreatePolicyDto> {
    try {
      const { action, app, object, subject, status } =
        await this.deletePolicie(policy)
      await this.authZManagerService.addPolicy(
        subject,
        object,
        action,
        app,
        status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE,
      )
    } catch {
      throw new RpcException(
        new PreconditionFailedException('Ocurrio un error al cambiar estado'),
      )
    }
    return policy
  }

  /**
   * Cambia el estado de las políticas asociadas a un rol específico.
   * @description
   * Este método actualiza el estado de todas las políticas vinculadas a un rol dado,
   * modificando el valor de una posición específica dentro de cada política para reflejar
   * el nuevo estado proporcionado. Las políticas son primero filtradas por el identificador
   * del rol y luego actualizadas con el nuevo estado. Las políticas antiguas son removidas
   * y las actualizadas son añadidas de nuevo al servicio de gestión de autorizaciones.
   *
   * @param {string} idRole El identificador del rol cuyas políticas serán actualizadas.
   * @param {string} status El nuevo estado a aplicar a las políticas del rol especificado.
   *
   * @throws {RpcException} Lanza una excepción si ocurre un error durante la actualización
   * de las políticas, indicando que la operación no pudo completarse satisfactoriamente.
   *
   * @returns {Promise<void>} Una promesa que se resuelve sin valor si la operación es exitosa.
   */
  async changePoliciesByRoleState(
    idRole: string,
    status: string,
  ): Promise<void> {
    const policies = await this.authZManagerService.getFilteredPolicy(0, idRole)
    if (!policies || policies.length === 0) {
      return
    }
    try {
      const updatedPolicies = policies.map((policy) => {
        policy[4] = status
        return policy
      })
      await this.authZManagerService.removeFilteredPolicy(0, idRole)
      await this.authZManagerService.addPolicies(updatedPolicies)
    } catch (error) {
      throw new RpcException(
        new PreconditionFailedException('Ocurrio un error al cambiar estado'),
      )
    }
  }

  /**
   * Obtiene las políticas asociadas a un rol específico para el frontend.
   *
   * Este método asincrónico recupera las políticas de autorización filtradas por un rol específico
   * y luego las procesa para devolver solo aquellas que son aplicables al frontend y están activas.
   *
   * @param {string} idRole El identificador del rol para el cual se están solicitando las políticas.
   * @returns {Promise<Array<{subject: string, object: string, action: string}>>} Una promesa que resuelve
   *          a un arreglo de objetos, donde cada objeto representa una política activa para el frontend
   *          con los campos 'subject', 'object' y 'action'.
   * @description
   * El proceso se realiza en los siguientes pasos:
   * 1. Llama a `authZManagerService.getFilteredPolicy` con `0` y `idRole` como argumentos para obtener
   *    todas las políticas asociadas al rol especificado.
   * 2. Transforma el arreglo de políticas en un nuevo arreglo de objetos con las propiedades `subject`,
   *    `object`, `action`, `app`, y `status` extraídas de cada política.
   * 3. Filtra este arreglo para incluir solo aquellas políticas cuya aplicación es el frontend (`APP.FRONTEND`)
   *    y cuyo estado es activo (`STATUS.ACTIVE`).
   * 4. Finalmente, mapea el resultado filtrado para incluir solo las propiedades `subject`, `object`, y `action`
   *    de cada política y devuelve este arreglo.
   */
  async getPoliciesByRoleFrontend(
    idRole: string,
  ): Promise<Array<{ subject: string; object: string; action: string }>> {
    const policies = await this.authZManagerService.getFilteredPolicy(0, idRole)
    const result = policies
      .map((item) => ({
        subject: item[0],
        object: item[1],
        action: item[2],
        app: item[3],
        status: item[4],
      }))
      .filter(
        (policy) =>
          policy.app === APP.FRONTEND && policy.status === STATUS.ACTIVE,
      )

    return result.map(({ subject, object, action }) => ({
      subject,
      object,
      action,
    }))
  }

  //Metodo a revisar permanencia
  async getPoliciesByRoute(route: string, user: PassportUser) {
    const result = await this.authZManagerService.getFilteredPolicy(1, route)
    if (!result || result.length === 0) {
      throw new RpcException(
        new NotFoundException('No se encontraron politicas asociadas'),
      )
    }
    const policy = result.find((policy) => policy[0] === user.idRole)
    if (!policy)
      throw new RpcException(
        new ForbiddenException('El rol no tiene permisos para esta ruta'),
      )

    return {
      route: policy[1],
      policy: policy[2],
    }
  }
}
