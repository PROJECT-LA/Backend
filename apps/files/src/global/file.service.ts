import { Injectable } from '@nestjs/common'
import { createWriteStream, existsSync, readFile, unlink } from 'fs'
import { join } from 'path'
import { RpcException } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FileService {
  constructor(private configService: ConfigService) {}

  async writeToFile(
    name: string,
    buffer: Buffer,
    basePath: string,
  ): Promise<string> {
    const route = this.configService.get<string>(basePath)
    if (!route) {
      throw new RpcException('La variable de entorno no ha sido configurada.')
    }
    if (!existsSync(route)) {
      throw new RpcException('La ruta de archivos no ha sido configurada.')
    }
    const filePath = join(route, name)
    await this.writeFile(filePath, buffer)
    return name
  }

  private writeFile(filePath: string, buffer: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const writeStream = createWriteStream(filePath)
      writeStream.write(Buffer.from(buffer))
      writeStream.on('error', (error) => {
        writeStream.close()
        reject(error)
      })
      writeStream.on('finish', () => {
        writeStream.close()
        resolve()
      })
      writeStream.end()
    })
  }

  async fileToBase64(route: string, name: string): Promise<string> {
    const filePath = join(route, name)
    return new Promise((resolve, reject) => {
      readFile(filePath, { encoding: 'base64' }, (err, data) => {
        if (err) {
          reject(new RpcException('No se pudo leer el archivo.'))
        } else {
          resolve(data)
        }
      })
    })
  }

  async removeFile(route: string, name: string): Promise<void> {
    const filePath = join(route, name)
    return new Promise((resolve, reject) => {
      unlink(filePath, (err) => {
        if (err) {
          reject(new RpcException('No se pudo eliminar el archivo.'))
        } else {
          resolve()
        }
      })
    })
  }

  verifyFileExistence(route: string, name: string): boolean {
    const filePath = join(route, name)
    return existsSync(filePath)
  }
}
