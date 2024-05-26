import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'refresh_tokens' })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({
    comment: 'Id del usuario',
    type: 'bigint',
  })
  grantId: string

  @Column({
    comment: 'token generado',
    type: 'text',
  })
  token: string

  @Column({
    type: 'datetime',
    comment: 'Fecha de creación de token',
  })
  iat: Date

  @Column({
    type: 'datetime',
    comment: 'Fecha expiración de token',
  })
  exp: Date
}
