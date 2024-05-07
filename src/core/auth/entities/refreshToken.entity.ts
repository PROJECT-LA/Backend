import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class RefreshTokens {
  @PrimaryColumn({
    comment: 'Clave primaria de la tabla RefreshToken',
  })
  id: string

  @Column({
    name: 'grant_id',
    comment: 'Id de usuario al que se le asignó el token generado',
  })
  grantId: string

  @Column({
    type: 'timestamp',
    comment: 'Fecha de creación de token',
  })
  iat: string

  @Column({
    name: 'expires_at',
    type: 'timestamp',
    comment: 'Fecha expiración de token',
  })
  expiresAt: string

  @Column({
    name: 'is_revoked',
    type: 'boolean',
    comment: 'Estado de token, valor booleano para revocar el token generado',
  })
  isRevoked: boolean
}
