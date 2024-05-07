export interface PassportUser {
  id: string
  roles: RolePassport[]
  idRole: string
  roleName: string
  idToken?: string
  accessToken?: string
  refreshToken?: string
  exp?: number
  iat?: number
}
export interface RolePassport {
  id: string
  name: string
}
