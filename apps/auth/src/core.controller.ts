import { Get } from '@nestjs/common'
import { Request, Response } from 'express'

class CoreController {
  public healthCheck(req: Request, res: Response): void {
    // Lógica para verificar el estado de la aplicación
    const status = 'OK'
    res.status(200).json({ status })
  }

  @Get('/download')
  public downloadFile(req: Request, res: Response): void {
    // Lógica para la descarga de archivos
    const filePath = '/path/to/file' // Ruta del archivo a descargar
    res.download(filePath)
  }

  @Get('/upload')
  public uploadFile(req: Request, res: Response): void {
    // Lógica para la subida de archivos
    const filePath = '/path/to/file' // Ruta del archivo a subir
    res.download(filePath)
  }
}

export default new CoreController()
