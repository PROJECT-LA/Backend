import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common'
import {
  ChangePaswwordDto,
  CreateUserDto,
  FilterUserDto,
  UpdateProfileDto,
  UpdateUserDto,
  STATUS,
  TextService,
  Configurations,
  PassportUser,
} from '@app/common'
import { IUserRepository } from '../interface'
import {
  DeleteResult,
  Equal,
  FindManyOptions,
  In,
  Like,
  UpdateResult,
} from 'typeorm'
import { IRoleRepository } from '../../roles/interface'
import { RpcException } from '@nestjs/microservices'
import { ExternalFileService } from '../../external/external-file.service'
import { User } from '../entities'

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly usersRepository: IUserRepository,
    @Inject('IRoleRepository')
    private readonly rolesRepository: IRoleRepository,
    private readonly externalFileService: ExternalFileService,
  ) {}

  /**
   * Lista los usuarios con paginación y filtrado.
   *
   * Este método asincrónico recibe un DTO de paginación y filtrado para usuarios,
   * construye un conjunto de opciones de búsqueda basado en estos parámetros, y
   * realiza una consulta paginada a la base de datos para obtener los usuarios que
   * coinciden con los criterios de búsqueda.
   *
   * @param {FilterUserDto} paginationQueryDto - DTO que contiene los parámetros de filtrado,
   * incluyendo el término de búsqueda (`filter`), el número de registros a saltar (`skip`),
   * y el límite de registros a retornar (`limit`).
   *
   * @returns Una promesa que resuelve a una lista de usuarios que coinciden con los
   * criterios de búsqueda, junto con información de paginación.
   *
   * La búsqueda se realiza en los campos `names`, `lastNames`, y `ci` del usuario,
   * utilizando el término de búsqueda proporcionado en `filter`. Además, se especifican
   * las relaciones y campos a seleccionar para cada usuario en el resultado, incluyendo
   * sus roles y varios campos personales y de contacto.
   *
   * Los resultados son ordenados por el apellido (`lastNames`) de manera ascendente.
   */
  async list(paginationQueryDto: FilterUserDto): Promise<[User[], number]> {
    const { filter, skip, limit } = paginationQueryDto
    const options: FindManyOptions<User> = {
      where: [
        {
          names: Like(`%${filter}%`),
        },
        {
          lastNames: Like(`%${filter}%`),
        },
        {
          ci: Like(`%${filter}%`),
        },
      ],
      relations: { roles: true },
      select: {
        id: true,
        names: true,
        lastNames: true,
        username: true,
        phone: true,
        ci: true,
        email: true,
        address: true,
        status: true,
        roles: {
          id: true,
          name: true,
        },
      },
      skip,
      take: limit,
      order: {
        id: 'ASC',
      },
    }
    return await this.usersRepository.getPaginateItems(options)
  }

  /**
   * Obtiene una lista de usuarios activos que coinciden con un rol específico.
   *
   * Este método asincrónico busca en el repositorio de usuarios aquellos que están activos
   * y que coinciden con el ID de rol proporcionado. Utiliza opciones de búsqueda avanzadas
   * para filtrar, seleccionar campos específicos y ordenar los resultados.
   *
   * @param {string} idRole - El ID del rol por el cual filtrar los usuarios.
   * @returns Una promesa que resuelve a una lista de usuarios que cumplen con los criterios de búsqueda.
   *
   * Los criterios de búsqueda especifican que el usuario debe estar activo (`status: Equal(STATUS.ACTIVE)`)
   * y debe tener un rol que coincida con `idRole`. Además, se establece una relación con la entidad `roles`
   * para poder filtrar por esta condición.
   *
   *
   */
  async getUsersByRole(idRole: string): Promise<User[]> {
    const options: FindManyOptions<User> = {
      where: {
        status: Equal(STATUS.ACTIVE),
        roles: {
          id: Equal(idRole),
        },
      },
      relations: { roles: true },
      select: {
        id: true,
        names: true,
        lastNames: true,
        ci: true,
        roles: {
          id: true,
          name: true,
        },
      },
      order: {
        id: 'ASC',
      },
    }
    return await this.usersRepository.findManyByConditions(options)
  }

  /**
   * Crea un nuevo usuario en la base de datos.
   *
   * Este método valida primero los roles del usuario y luego crea un nuevo usuario
   * con los datos proporcionados. La contraseña se establece a un valor predeterminado
   * y se encripta antes de guardar el usuario.
   *
   * @param {CreateUserDto} createUserDto - DTO con los datos del usuario a crear.
   * @returns El usuario recién creado.
   * @throws Si la validación de roles falla o si hay un error al guardar el usuario.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const roles = await this.Validate({
      username: createUserDto.username,
      email: createUserDto.email,
      ci: createUserDto.ci,
      roles: createUserDto.roles,
    })

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: await TextService.encrypt(Configurations.DEFAULT_PASSWORD),
      roles,
    })
    return await this.usersRepository.save(newUser)
  }

  /**
   * Actualiza la información de un usuario existente.
   *
   * Este método permite actualizar los datos de un usuario específico, identificado por `idUser`.
   * Se realiza una verificación para asegurar que el usuario actual no esté intentando editar su propio perfil.
   * Además, valida los roles del usuario antes de proceder con la actualización.
   *
   * @param {string} idUser - El ID del usuario a actualizar.
   * @param {UpdateUserDto} updateUserDto - Objeto que contiene los datos del usuario a actualizar.
   * @param {PassportUser} currentUser - El usuario actual que realiza la solicitud de actualización.
   * @returns {Promise<User>} - Promesa que resuelve al usuario actualizado.
   * @throws {RpcException} - Lanza una excepción si el usuario actual intenta editar su propio perfil.
   */
  async update(
    idUser: string,
    updateUserDto: UpdateUserDto,
    currentUser: PassportUser,
  ): Promise<User> {
    await this.getUserProfile(idUser)

    if (currentUser.id === idUser) {
      throw new RpcException(
        new ForbiddenException('No puedes editar tu perfil'),
      )
    }

    const roles = await this.Validate(
      {
        username: updateUserDto.username,
        email: updateUserDto.email,
        ci: updateUserDto.ci,
        roles: updateUserDto.roles,
      },
      idUser,
    )

    const updateUser = this.usersRepository.create({
      ...updateUserDto,
      id: idUser,
      roles,
    })

    return await this.usersRepository.save(updateUser)
  }

  /**
   * Elimina un usuario específico de la base de datos.
   *
   * Antes de proceder con la eliminación, este método verifica si el usuario actual está intentando eliminar su propia cuenta,
   * lo cual no está permitido. Si la verificación es exitosa, procede a eliminar el usuario de la base de datos.
   *
   * @param {string} idUser - El ID del usuario a eliminar.
   * @param {PassportUser} currentUser - El usuario actual que realiza la solicitud de eliminación.
   * @returns {Promise<DeleteResult>} - Promesa que resuelve al resultado de la operación de eliminación.
   * @throws {RpcException} - Lanza una excepción si el usuario actual intenta eliminar su propia cuenta.
   */
  async delete(
    idUser: string,
    currentUser: PassportUser,
  ): Promise<DeleteResult> {
    await this.getUserProfile(idUser)
    if (currentUser.id === idUser) {
      throw new RpcException(
        new ForbiddenException('No puedes eliminar tu cuenta'),
      )
    }
    return await this.usersRepository.delete(idUser)
  }

  /**
   * Actualiza el perfil de un usuario.
   *
   * Este método actualiza el perfil de un usuario basado en el ID proporcionado y los datos del DTO de actualización.
   * Primero, verifica si el usuario existe llamando a `getUserProfile`. Luego, verifica si el email proporcionado en
   * `updateUserDto` ya está registrado por otro usuario. Si el email ya existe y pertenece a otro usuario, se lanza una excepción.
   * Si no hay conflictos, se procede a actualizar la información del usuario en la base de datos.
   *
   * @param {string} id - El ID del usuario cuyo perfil se va a actualizar.
   * @param {UpdateProfileDto} updateUserDto - Objeto DTO que contiene la información para actualizar el perfil del usuario.
   * @returns {Promise<UpdateResult>} - Promesa que resuelve al resultado de la operación de actualización.
   * @throws {RpcException} - Lanza una excepción si el email proporcionado ya está registrado por otro usuario.
   */
  async updateProfile(
    id: string,
    updateUserDto: UpdateProfileDto,
  ): Promise<UpdateResult> {
    await this.getUserProfile(id)
    const emailExists = await this.findOneByEmail(updateUserDto.email)
    if (emailExists && emailExists.id !== id) {
      throw new RpcException(
        new BadRequestException('El email proporcionado ya esta registrado'),
      )
    }
    const updateUser = this.usersRepository.create(updateUserDto)
    return await this.usersRepository.update(id, updateUser)
  }

  async updateImageProfile(id: string, image: Express.Multer.File) {
    const user = await this.getUserProfile(id)
    const isServiceAvaliable =
      await this.externalFileService.isServiceAvaliable()
    if (!isServiceAvaliable) {
      throw new RpcException(
        new PreconditionFailedException(
          'Servicio de almacenamiento no disponible',
        ),
      )
    }
    const updateUser = this.usersRepository.create({ image: '' })
    try {
      if (user.image) {
        // await this.externalFileService.deleteImage(user.image)
      }
      const nameFile = await this.externalFileService.writteImage(
        image,
        user.id,
      )
      updateUser.image = nameFile
    } catch (error) {
      throw new RpcException(
        new PreconditionFailedException('Error al guardar la imagen'),
      )
    }

    return await this.usersRepository.update(id, updateUser)
  }

  /**
   * Actualiza la contraseña de un usuario.
   *
   * Este método permite a un usuario cambiar su contraseña. Primero, verifica que el usuario exista
   * buscándolo por su ID. Luego, compara la contraseña actual proporcionada con la almacenada en la base de datos
   * para asegurarse de que coincidan. Si las contraseñas coinciden, la nueva contraseña es encriptada y actualizada
   * en la base de datos.
   *
   * Nota: La validación del nivel de seguridad de la nueva contraseña está comentada y puede ser implementada según sea necesario.
   *
   * @param {string} id - El ID del usuario cuya contraseña se va a actualizar.
   * @param {ChangePaswwordDto} changePaswwordDto - Objeto DTO que contiene la contraseña actual y la nueva contraseña.
   * @returns {Promise<UpdateResult>} - Promesa que resuelve al resultado de la operación de actualización.
   * @throws {RpcException} - Lanza una excepción si el usuario no es encontrado o si las contraseñas no coinciden.
   */
  async updatePassword(
    id: string,
    changePaswwordDto: ChangePaswwordDto,
  ): Promise<UpdateResult> {
    const { newPassword, password } = changePaswwordDto
    const user = await this.usersRepository.findOneByCondition({
      where: { id },
      select: {
        id: true,
        password: true,
      },
    })
    if (!user) {
      throw new RpcException(new NotFoundException('Usuario no encontrado'))
    }
    const passwordIsValid = await TextService.compare(password, user.password)
    if (!passwordIsValid) {
      throw new RpcException(
        new BadRequestException('Las contraseñas no coinciden'),
      )
    }
    //await TextService.validateLevelPassword(newPassword);
    const hashedPassword = await TextService.encrypt(newPassword)
    return await this.usersRepository.update(id, { password: hashedPassword })
  }

  /**
   * Restablece la contraseña de un usuario a la contraseña predeterminada.
   *
   * Este método busca primero al usuario por su ID para asegurarse de que exista.
   * Luego, restablece su contraseña a una contraseña predeterminada definida en la configuración del sistema.
   * La contraseña predeterminada es encriptada antes de ser actualizada en la base de datos.
   *
   * @param {string} id - El ID del usuario cuya contraseña será restablecida.
   * @returns {Promise<UpdateResult>} - Promesa que devuelve el reultado de la operacion.
   */
  async resetPassword(id: string): Promise<UpdateResult> {
    await this.usersRepository.findOneByCondition({
      where: { id },
      select: ['id', 'password'],
    })
    const hashedPassword = await TextService.encrypt(
      Configurations.DEFAULT_PASSWORD,
    )
    return await this.usersRepository.update(id, { password: hashedPassword })
  }

  /**
   * Cambia el estado de un usuario.
   *
   * Este método cambia el estado de un usuario de activo a inactivo y viceversa,
   * excepto si el usuario intenta cambiar su propio estado, en cuyo caso se lanza una excepción.
   *
   * @param {string} idUser El ID del usuario cuyo estado se va a cambiar.
   * @param {PassportUser} currentUser El usuario actual que realiza la solicitud.
   * @returns {Promise<{id: string, status: STATUS}>} Un objeto que contiene el ID del usuario y su nuevo estado.
   *
   * @throws {RpcException} Lanza una excepción si el usuario actual intenta cambiar su propio estado.
   *
   */
  async changeStatus(
    idUser: string,
    currentUser: PassportUser,
  ): Promise<UpdateResult> {
    if (!idUser) {
      throw new RpcException(new BadRequestException('ID de usuario inválido'))
    }
    if (currentUser.id === idUser) {
      throw new RpcException(
        new ForbiddenException('No puedes cambiar el estado de tu perfil'),
      )
    }
    const { status } = await this.getUserProfile(idUser)
    const newStatus = status === STATUS.ACTIVE ? STATUS.INACTIVE : STATUS.ACTIVE
    return await this.usersRepository.update(idUser, { status: newStatus })
  }

  /**
   * Obtiene el perfil de un usuario por su ID.
   *
   * Este método asincrónico busca en el repositorio de usuarios un usuario específico
   * por su ID. Utiliza `findOneByCondition` para realizar una búsqueda detallada,
   * incluyendo relaciones y seleccionando campos específicos del usuario y sus roles.
   *
   * @param {string} id - El ID único del usuario a buscar.
   * @returns Retorna un objeto que representa el perfil del usuario si es encontrado.
   *
   * @throws {RpcException} - Lanza una excepción si el usuario no es encontrado.
   *
   * Si el usuario no es encontrado, se lanza una excepción `RpcException` con un mensaje
   * indicando que el usuario no fue encontrado. Esto es útil para manejar errores en
   * aplicaciones que utilizan llamadas RPC (Remote Procedure Call).
   */
  async getUserProfile(id: string): Promise<User> {
    const user = await this.usersRepository.findOneByCondition({
      where: { id },
      relations: { roles: true },
      select: {
        id: true,
        names: true,
        lastNames: true,
        email: true,
        username: true,
        phone: true,
        ci: true,
        address: true,
        image: true,
        status: true,
        roles: {
          id: true,
          name: true,
        },
      },
    })
    if (!user)
      throw new RpcException(new NotFoundException('Usuario no encontrado'))
    return user
  }

  /**
   * Valida la información de un usuario antes de su creación o actualización.
   *
   * Este método realiza varias comprobaciones para asegurar que la información proporcionada
   * para un usuario es válida y no viola restricciones de unicidad en el sistema. Verifica
   * que el nombre de usuario, el correo electrónico y la cédula de identidad (CI) no estén
   * ya registrados por otro usuario (a menos que se esté actualizando el mismo usuario).
   * También asegura que se haya seleccionado al menos un rol y que los roles existan en la base de datos.
   *
   * @param data Un objeto que contiene el nombre de usuario, correo electrónico, CI y roles del usuario.
   * @param id El ID opcional del usuario que se está actualizando. Si se proporciona, se permite
   * que los valores de nombre de usuario, correo electrónico y CI coincidan con los del usuario actual.
   *
   * @throws RpcException Si alguna de las validaciones falla, se lanza una excepción con un mensaje
   * adecuado indicando la razón del fallo.
   *
   * @returns Una promesa que resuelve a los roles con estado activo encontrados en la base de datos si todas las
   * validaciones pasan.
   */
  private async Validate(
    data: { username: string; email: string; ci: string; roles: string[] },
    id?: string,
  ) {
    const { username, email, ci, roles } = data
    if (id) await this.getUserProfile(id)

    const userExists = await this.findOneByUsername(username)
    if (userExists && (id === undefined || userExists.id !== id)) {
      throw new RpcException(
        new BadRequestException('Nombre de usario ya registrado'),
      )
    }

    const emailExists = await this.findOneByEmail(email)
    if (emailExists && (id === undefined || emailExists.id !== id)) {
      throw new RpcException(
        new BadRequestException('Email ya esta registrado'),
      )
    }

    const ciExists = await this.findOneByCi(ci)
    if (ciExists && (id === undefined || ciExists.id !== id)) {
      throw new RpcException(
        new BadRequestException('El ci proporcionado ya esta registrado'),
      )
    }

    if (data.roles.length === 0) {
      throw new RpcException(
        new BadRequestException('Debe proporcionar al menos un rol'),
      )
    }

    const foundRoles = await this.rolesRepository.findManyByConditions({
      where: {
        id: In(roles),
        status: Equal(STATUS.ACTIVE),
      },
    })

    if (foundRoles.length < 1) {
      throw new RpcException(
        new NotFoundException('No se proporcionaron roles validos'),
      )
    }
    return foundRoles
  }

  /**
   * Busca un usuario por su nombre de usuario.
   *
   * Este método utiliza `usersRepository` para buscar en la base de datos un usuario
   * que coincida con el nombre de usuario proporcionado. Solo selecciona y retorna
   * los campos `id` y `username` del usuario encontrado.
   *
   * @param username El nombre de usuario del usuario a buscar.
   * @returns Una promesa que resuelve al usuario encontrado o `null` si no se encuentra.
   */
  async findOneByUsername(username: string) {
    return await this.usersRepository.findOneByCondition({
      where: { username },
      select: {
        id: true,
        username: true,
      },
    })
  }

  /**
   * Busca un usuario por su correo electrónico.
   *
   * Utiliza `usersRepository` para realizar una búsqueda en la base de datos por un usuario
   * que coincida con el correo electrónico proporcionado. Retorna únicamente los campos
   * `id` y `email` del usuario encontrado.
   *
   * @param email El correo electrónico del usuario a buscar.
   * @returns Una promesa que resuelve al usuario encontrado o `null` si no se encuentra.
   */
  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneByCondition({
      where: { email },
      select: { id: true, email: true },
    })
  }

  /**
   * Busca un usuario por su cédula de identidad (CI).
   *
   * Este método hace uso de `usersRepository` para buscar en la base de datos un usuario
   * que coincida con la CI proporcionada. Retorna solamente los campos `id` y `ci`
   * del usuario encontrado.
   *
   * @param ci La cédula de identidad del usuario a buscar.
   * @returns Una promesa que resuelve al usuario encontrado o `null` si no se encuentra.
   */
  async findOneByCi(ci: string) {
    return await this.usersRepository.findOneByCondition({
      where: { ci },
      select: { id: true, ci: true },
    })
  }
}
