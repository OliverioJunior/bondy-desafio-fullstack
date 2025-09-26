import React, { useState } from 'react'
import { LoginForm } from '../../components/composite/LoginForm'

// import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'
import { useAuthContext } from '../../contexts/useAuthContext'
import { useNavigate } from 'react-router-dom'
interface ILoginFormData {
  email: string
  password: string
}

export const LoginPage: React.FC = () => {
  const { login } = useAuthContext()
  const navigate = useNavigate()
  const [loginError, setLoginError] = useState<string>('')

  const handleLogin = async (data: ILoginFormData) => {
    setLoginError('')

    const result = await login(data.email, data.password)

    if (result.success) {
      navigate('/dashboard')
    } else {
      setLoginError(result.error || 'Erro ao fazer login')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Bem-vindo</h1>
          <p className={styles.subtitle}>Faça login para acessar sua conta</p>
        </div>

        <div className={styles.formContainer}>
          <LoginForm onSubmit={handleLogin} className={styles.form} />

          {loginError && (
            <div className={styles.errorMessage} role="alert">
              {loginError}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
