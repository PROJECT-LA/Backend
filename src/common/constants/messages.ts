export enum Messages {
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
}
