export enum Messages {
  //GENERAL
  EXCEPTION_BAD_REQUEST = 'Existen errores en la solicitud.',
  EXCEPTION_UNAUTHORIZED = 'Usuario no autorizado.',
  EXCEPTION_FORBIDDEN = 'No tiene permisos para acceder a este recurso.',
  EXCEPTION_NOT_FOUND = 'No se encontró el recurso solicitado.',
  EXCEPTION_DEFAULT = 'Error desconocido',
  EXCEPTION_INTERNAL_SERVER_ERROR = 'Error interno del servidor.',
  EXCEPTION_UPDATE_ERROR = 'Error al actualizar el registro.',

  //RESPONSES FROM CONTROLLER
  REPONSE_SUCCESS = 'Se completo con exito',
  RESPONCE_SUCCESS_LIST = 'Se obtuvieron los registros con éxito.',
  RESPONSE_SUCCESS_CREATE = 'Registro creado con éxito.',
  RESPONSE_SUCCESS_UPDATE = 'Registro actualizado con éxito.',
  RESPONSE_SUCCESS_DELETE = 'Registro eliminado con éxito.',
}
