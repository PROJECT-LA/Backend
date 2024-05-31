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
import { RpcException } from '@nestjs/microservices'
import { from } from 'rxjs'
import { ConfigService } from '@nestjs/config'
@Injectable()
export class FileService {
  constructor(private readonly configService: ConfigService) {}

  writteAvatars(name: string, buffer: Express.Multer.File) {
    return from(
      new Promise((resolve, reject) => {
        try {
          const route = this.configService.get<string>('AVATARS_PATH')
          if (!route) {
            throw new RpcException(
              'La variable de entorno no ha sido configurada.',
            )
          }
          if (!existsSync(route)) {
            throw new RpcException('La ruta de archivos no ha sido configurado')
          }
          const filePath = path.join(route, name)
          const writeStream = createWriteStream(filePath)
          writeStream.write(Buffer.from(buffer.buffer))
          writeStream.on('finish', () => {
            writeStream.close()
            resolve(name)
          })
          writeStream.end()
        } catch (error) {
          reject(new RpcException(error))
        }
      }),
    )
  }
  writteFile(
    route: string | undefined,
    name: string,
    buffer: Express.Multer.File,
  ) {
    return from(
      new Promise((resolve, reject) => {
        try {
          if (!route) {
            throw new RpcException(
              'La variable de entorno no ha sido configurada.',
            )
          }
          if (!existsSync(route)) {
            throw new RpcException('La ruta de archivos no ha sido configurado')
          }
          const filePath = path.join(route, name)
          const writeStream = createWriteStream(filePath)
          writeStream.write(Buffer.from(buffer.buffer))
          writeStream.on('finish', () => {
            writeStream.close()
            resolve(name)
          })
          writeStream.end()
        } catch (error) {
          reject(new RpcException(error))
        }
      }),
    )
  }
  getAvatar(name: string) {
    const route = this.configService.get<string>('AVATARS_PATH')
    return this.fileToBase64(route, name)
  }

  readFile(route: string, name: string) {
    const baseRoute = route
    const ruta = path.join(baseRoute, name)
    const fileStream = createReadStream(ruta)
    return new StreamableFile(fileStream)
  }

  fileToBase64(route: string, name: string): Promise<string> {
    const filePath = path.join(route, name)
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, { encoding: 'base64' }, (err, data) => {
        if (err) {
          reject(new RpcException('No se pudo leer el archivo.'))
        } else {
          resolve(data)
        }
      })
    })
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
