// Parámetros de configuración
import dotenv from 'dotenv'
dotenv.config()

export enum Configurations {
  SCORE_PASSWORD = 3, // NIVEL MÍNIMO DE CALIFICACIÓN PASSWORD
  SALT_ROUNDS = 10, // NUMERO DE SALTOS PARA GENERACIÓN DE HASH
}

export enum fileConfigurations {
  MAX_SIZE = 1024 * 1024 * 5, // 5MB
  MAX_FILES = 1, // 1 archivo
  FILE_TYPE = 'pdf',
}

export const AVATARS_PATH = process.env.AVATARS_PATH || 'uploads/avatars/'

export const MAX_IMAGE_LENGTH = +(process.env.MAX_MB_IMAGE || 1) * 1024 * 1024
