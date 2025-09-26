import React from 'react'

import { Button } from '../../components/ui/Button'
import styles from './Dashboard.module.css'
import { useAuthContext } from '../../contexts/useAuthContext'

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthContext()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
        <div className={styles.userInfo}>
          <span className={styles.welcome}>
            Bem-vindo, {user?.name || user?.email}!
          </span>
          <Button variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.card}>
          <h2>Área Protegida</h2>
          <p>
            Esta é uma área protegida que só pode ser acessada por usuários
            autenticados.
          </p>
          <p>
            <strong>Dados do usuário:</strong>
          </p>
          <ul>
            <li>Email: {user?.email}</li>
            <li>Nome: {user?.name || 'Não informado'}</li>
            <li>ID: {user?.id}</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
