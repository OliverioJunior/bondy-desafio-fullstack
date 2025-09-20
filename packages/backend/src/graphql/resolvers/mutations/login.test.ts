import { login } from './login'
import { User } from '../../../models/User'

jest.mock('../../../models/User', () => ({
  User: {
    findOne: jest.fn(),
  },
}))

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}))

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}))

const mockUser = User as jest.Mocked<typeof User>
const mockBcrypt = require('bcrypt')
const mockJwt = require('jsonwebtoken')

const originalEnv = process.env
beforeAll(() => {
  process.env = {
    ...originalEnv,
    JWT_SECRET: 'test-jwt-secret-key',
  }
})

afterAll(() => {
  process.env = originalEnv
})

describe('Login Function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  describe('Success scenarios', () => {
    it('should return user data when credentials are valid', async () => {
      const mockUserData = {
        _id: '507f1f77bcf86cd799439011',
        id: '507f1f77bcf86cd799439011',
        name: 'Usuário Teste',
        email: 'teste@bondy.com.br',
        company: 'Bondy',
        password: 'hashedPassword123',
      }

      const loginArgs = {
        email: 'teste@bondy.com.br',
        password: '123456',
      }

      mockUser.findOne.mockResolvedValue(mockUserData)
      mockBcrypt.compare.mockResolvedValue(true)
      mockJwt.sign.mockReturnValue('mock-jwt-token')

      const result = await login(null, loginArgs, null, null)

      expect(mockUser.findOne).toHaveBeenCalledWith({ email: loginArgs.email })
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        loginArgs.password,
        mockUserData.password
      )
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { userId: mockUserData.id },
        'test-jwt-secret-key',
        { expiresIn: '24h' }
      )
      expect(result).toEqual({
        token: 'mock-jwt-token',
        user: {
          id: mockUserData._id,
          name: mockUserData.name,
          email: mockUserData.email,
          company: mockUserData.company,
        },
      })
      expect(result.user).not.toHaveProperty('password')
    })
  })

  describe('Failure scenarios', () => {
    it('should throw error when email is not provided', async () => {
      const loginArgs = {
        email: '',
        password: '123456',
      }

      await expect(login(null, loginArgs, null, null)).rejects.toThrow(
        'Usuário ou senhas precisam ser preenchidos'
      )
    })

    it('should throw error when password is not provided', async () => {
      const loginArgs = {
        email: 'teste@bondy.com.br',
        password: '',
      }

      await expect(login(null, loginArgs, null, null)).rejects.toThrow(
        'Usuário ou senhas precisam ser preenchidos'
      )
    })

    it('should throw error when user is not found', async () => {
      const loginArgs = {
        email: 'inexistente@bondy.com.br',
        password: '123456',
      }

      mockUser.findOne.mockResolvedValue(null)

      await expect(login(null, loginArgs, null, null)).rejects.toThrow(
        'Usuário ou senha inválidos.'
      )
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: loginArgs.email })
    })

    it('should throw error when password is invalid', async () => {
      const mockUserData = {
        _id: '507f1f77bcf86cd799439011',
        id: '507f1f77bcf86cd799439011',
        name: 'Usuário Teste',
        email: 'teste@bondy.com.br',
        company: 'Bondy',
        password: 'hashedPassword123',
      }

      const loginArgs = {
        email: 'teste@bondy.com.br',
        password: 'senhaErrada',
      }

      mockUser.findOne.mockResolvedValue(mockUserData)

      mockBcrypt.compare.mockResolvedValue(false)

      await expect(login(null, loginArgs, null, null)).rejects.toThrow(
        'Usuário ou senha inválidos.'
      )
      expect(mockUser.findOne).toHaveBeenCalledWith({ email: loginArgs.email })
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        loginArgs.password,
        mockUserData.password
      )
    })
  })

  describe('Security validations', () => {
    it('should not return password in the result', async () => {
      const mockUserData = {
        _id: '507f1f77bcf86cd799439011',
        id: '507f1f77bcf86cd799439011',
        name: 'Usuário Teste',
        email: 'teste@bondy.com.br',
        company: 'Bondy',
        password: 'hashedPassword123',
      }

      const loginArgs = {
        email: 'teste@bondy.com.br',
        password: '123456',
      }

      mockUser.findOne.mockResolvedValue(mockUserData)

      mockBcrypt.compare.mockResolvedValue(true)
      mockJwt.sign.mockReturnValue('mock-jwt-token')

      const result = await login(null, loginArgs, null, null)

      expect(result.user).not.toHaveProperty('password')
      expect(Object.keys(result.user)).toEqual([
        'id',
        'name',
        'email',
        'company',
      ])
      expect(result).toHaveProperty('token')
    })
  })
})
