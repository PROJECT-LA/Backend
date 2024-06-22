export interface PassportUser {
  id: string
  roles: RolePassport[]
  idRole?: string
  roleName?: string
  exp?: number
  iat?: number
}
export interface RolePassport {
  id: string
  name: string
}

export interface UserPayload {
  id: string
  idRole: string
  roleName: string
  roles: RolePassport[]
  userData: {
    names: string
    lastNames: string
    username: string
    email: string
    phone: string
    ci: string
    image?: any
  }
  token: string
  sidebarData: SectionPayload[]
}

export interface RefreshTokenPayload {
  userId: string
  token: string
}
export interface SectionPayload {
  id: string
  status: string
  title: string
  description: string
  subModule: ModulePayload[]
}

export interface ModulePayload {
  id: string
  status: string
  title: string
  url: string
  icon: string
  order: number
  idModule: string
  description: string
}
