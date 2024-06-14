// Parámetros de configuración
import dotenv from 'dotenv'
dotenv.config()

export const Configurations = {
  SCORE_PASSWORD: +process.env.DEFAULT_PASSWORD || 3, // NIVEL MÍNIMO DE CALIFICACIÓN PASSWORD
  SALT_ROUNDS: 10, // NUMERO DE SALTOS PARA GENERACIÓN DE HASH
  DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD || 'p4ssw0rd@bC',
}

// Configuración para la carga de archivos
export const FILE_UPLOAD_CONFIG = {
  // Tamaño máximo del archivo en bytes (por defecto: 15MB)
  MAX_SIZE: +(process.env.MAX_MB_FILE || 5) * 1024 * 1024,

  // Número máximo de archivos que se pueden cargar a la vez
  MAX_FILES: +(process.env.MAX_FILES || 5) * 1024 * 1024,

  // Ruta donde se guardarán los avatares cargados
  FILE_PATH: process.env.FILES_PATH || 'uploads/files/',
}

// Configuración para la carga de avatares
export const AVATAR_UPLOAD_CONFIG = {
  // Tamaño máximo del archivo en bytes (por defecto: 1MB)
  MAX_SIZE: +(process.env.MAX_MB_IMAGE || 1) * 1024 * 1024,

  // Número máximo de archivos que se pueden cargar a la vez
  MAX_FILES: 1,

  // Ruta donde se guardarán los avatares cargados
  FILE_PATH: process.env.AVATARS_PATH || 'uploads/avatars/',
}

export const AUTH_SERVICE = 'auth_service'

export const FILE_SERVICE = 'file_service'

export const AUDIT_SERVICE = 'audit_service'
