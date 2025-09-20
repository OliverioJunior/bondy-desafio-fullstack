import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { User } from '../../../models/User'
import { LoginArgs } from '../@types/login'

export const login = async (
  _parent: any,
  args: LoginArgs,
  _context: any,
  _info: any
) => {
  const { email, password } = args

  if (!email || !password)
    throw new Error('Usuário ou senhas precisam ser preenchidos')

  try {
    // Busca o usuário pelo email
    const user = await User.findOne({ email })

    if (!user) {
      throw new Error('Usuário ou senha inválidos.')
    }
    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new Error('Usuário ou senha inválidos.')
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    })
    // Retorna os dados do usuário (sem a senha por segurança)
    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
      },
    }
  } catch (error) {
    throw new Error(error.message || 'Erro interno do servidor')
  }
}
