import {
  Injectable,
  PreconditionFailedException,
  StreamableFile,
} from '@nestjs/common'
import fs, {
  createWriteStream,
  existsSync,
  createReadStream,
  unlinkSync,
} from 'fs'
import path from 'path'

@Injectable()
export class FileService {
  constructor() {}
  writteFile(route: string | undefined, name: string, buffer: Buffer) {
    try {
      if (!route) {
        throw new PreconditionFailedException(
          'La variable de entorno no ha sido configurada.',
        )
      }
      if (!existsSync(route)) {
        throw new PreconditionFailedException(
          'El route de archivos no ha sido configurado',
        )
      }
      const writeStream = createWriteStream(`${route}${name}`)
      writeStream.write(buffer)
      writeStream.close()
      writeStream.end()
    } catch (error) {
      throw new Error(error)
    }
  }

  readFile(route: string, name: string) {
    const baseRoute = route
    const ruta = path.join(baseRoute + name)
    const fileStream = createReadStream(ruta)
    return new StreamableFile(fileStream)
  }

  verifyFile(route: string, name: string) {
    const baseRoute = route
    const ruta = path.join(baseRoute + name)
    if (fs.existsSync(ruta)) {
      return true
    } else {
      return false
    }
  }

  removeFile(route: string, name: string) {
    try {
      if (!route) {
        throw new PreconditionFailedException(
          'La variable de entorno no ha sido configurada.',
        )
      }
      if (!existsSync(`${route}${name}`)) {
        throw new PreconditionFailedException('No se encontró el archivo.')
      } else {
        const removedFile = unlinkSync(`${route}${name}`)
        return removedFile
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}
