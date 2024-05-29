export enum Messages {
  //GENERAL
  EXCEPTION_BAD_REQUEST = 'Existen errores en la solicitud.',
  EXCEPTION_UNAUTHORIZED = 'Usuario no autorizado.',
  EXCEPTION_FORBIDDEN = 'No tiene permisos para acceder a este recurso.',
  EXCEPTION_NOT_FOUND = 'No se encontró el recurso solicitado.',
  EXCEPTION_DEFAULT = 'Error desconocido',
  EXCEPTION_INTERNAL_SERVER_ERROR = 'Error interno del servidor.',
  EXCEPTION_UPDATE_ERROR = 'Error al actualizar el registro.',
  //AUTHENTICATION

  INVALID_CREDENTIALS = 'Credenciales inválidas.',
  EXCEPTION_SAME_USERNAME = 'El nombre de usuario ya está en uso.',
  EXCEPTION_SAME_EMAIL = 'El correo electrónico ya está en uso.',
  EXCEPTION_USER_NOT_FOUND = 'Usuario no encontrado.',
  EXCEPTION_PASSWORD_NOT_VALID = 'La contraseña no es válida.',

  //AUTHORIZATION

  EXCEPTION_ROLE_NOT_FOUND = 'Rol no encontrado.',
  EXCEPTION_ROLE_NAME_EXISTS = 'El nombre del rol ya existe.',
  EXCEPTION_ROLE_NOT_SEND = 'No se envió ningún rol.',
  EXCEPTION_NOT_EXIST_ROLES = 'No se cuentan con roles en el sistema',

  //RESPONSES FROM CONTROLLER
  REPONSE_SUCCESS = 'Se completo con exito',
  RESPONCE_SUCCESS_LIST = 'Se obtuvieron los registros con éxito.',
  RESPONSE_SUCCESS_CREATE = 'Registro creado con éxito.',
  RESPONSE_SUCCESS_UPDATE = 'Registro actualizado con éxito.',
  RESPONSE_SUCCESS_DELETE = 'Registro eliminado con éxito.',

  //RESPONSE FOR TOKEN
  TOKEN_EXPIRED = 'Token expirado.',
  TOKEN_INVALID = 'Token inválido.',
  TOKEN_REVOCATED = 'Token revocado.',
  TOKEN_NOT_FOUND = 'Token no encontrado.',
  EXCEPTION_REFRESH_TOKEN_NOT_FOUND = 'Token de refresco no encontrado.',
  EXCEPTION_REFRESH_TOKEN_EXPIRED = 'Token de refresco expirado.',

  //POLICIES
  EXCEPTION_POLICY_NOT_FOUND = 'Política no encontrada.',
  EXCEPTION_POLICY_NAME_EXISTS = 'El nombre de la política ya existe.',
  EXCEPTION_POLICY_NOT_SEND = 'No se envió ninguna política.',
  EXCEPTION_POLICY_NOT_FOUND_ROLES = 'No se encontraron roles para la política.',
  EXCEPTION_POLICY_ERROR = 'No se encontraron módulos para la política.',
}
