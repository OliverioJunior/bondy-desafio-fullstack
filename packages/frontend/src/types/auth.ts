export interface User {
  id: string
  name: string
  email: string
  company?: string
}

export interface LoginResponse {
  login: {
    token: string
    user: User
  }
}

export interface LoginVariables {
  email: string
  password: string
}

export interface AuthContextType {
  user: User | null
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
  error: string | null
}

export interface JWTPayload {
  userId: string
  email?: string
  exp: number
  iat: number
}
