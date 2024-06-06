import { PreconditionFailedException } from '@nestjs/common'

export const pdfFilter = (req, file, callback) => {
  if (file.mimetype === 'application/pdf') {
    callback(null, true)
  } else {
    callback(
      new PreconditionFailedException('Todos los archivos deben ser PDF'),
      false,
    )
  }
}

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
    return callback(
      new PreconditionFailedException('El formato de la imágen es incorrecto.'),
      false,
    )
  }
  callback(null, true)
}
