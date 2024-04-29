export enum Messages {
  //GENERAL
  EXCEPTION_BAD_REQUEST = 'Existen errores en la solicitud.',
  EXCEPTION_UNAUTHORIZED = 'Usuario no autorizado.',
  EXCEPTION_FORBIDDEN = 'No tiene permisos para acceder a este recurso.',
  EXCEPTION_NOT_FOUND = 'No se encontró el recurso solicitado.',
  EXCEPTION_DEFAULT = 'Error desconocido',
  EXCEPTION_INTERNAL_SERVER_ERROR = 'Error interno del servidor.',

  //AUTHENTICATION

  INVALID_CREDENTIALS = 'Credenciales inválidas.',
  EXCEPTION_SAME_USERNAME = 'El nombre de usuario ya está en uso.',
  EXCEPTION_SAME_EMAIL = 'El correo electrónico ya está en uso.',
  EXCEPTION_USER_NOT_FOUND = 'Usuario no encontrado.',

  //AUTHORIZATION

  EXCEPTION_ROLE_NOT_FOUND = 'Rol no encontrado.',
  EXCEPTION_ROLE_NAME_EXISTS = 'El nombre del rol ya existe.',
  EXCEPTION_ROLE_NOT_SEND = 'No se envió ningún rol.',

  //RESPONSES FROM CONTROLLER
  REPONSE_SUCCESS = 'Se completo con exito',
  RESPONCE_SUCCESS_LIST = 'Se obtuvieron los registros con éxito.',
  RESPONSE_SUCCESS_CREATE = 'Registro creado con éxito.',
  RESPONSE_SUCCESS_UPDATE = 'Registro actualizado con éxito.',
  RESPONSE_SUCCESS_DELETE = 'Registro eliminado con éxito.',
}
