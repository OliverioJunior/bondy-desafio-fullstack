import React, { ComponentProps, FC, useState } from 'react'
import { Input } from '../../ui/Input'
import { Button } from '../../ui/Button'
import styles from './LoginForm.module.css'

interface ILoginFormData {
  email: string
  password: string
}

interface ILoginForm extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  onSubmit?: (data: ILoginFormData) => void | Promise<void>
}

export const LoginForm: FC<ILoginForm> = ({
  onSubmit,
  className,
  ...props
}) => {
  const [formData, setFormData] = useState<ILoginFormData>({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<Partial<ILoginFormData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: Partial<ILoginFormData> = {}

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      await onSubmit?.(formData)
    } catch (error) {
      console.error('Erro no login:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange =
    (field: keyof ILoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }))

      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }))
      }
    }

  const isLoading = isSubmitting

  return (
    <form
      role="form"
      onSubmit={handleSubmit}
      className={`${styles.container} ${className || ''}`}
      noValidate
      {...props}
    >
      <div className={styles.fields}>
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          required
          disabled={isLoading}
          autoComplete="email"
          placeholder="seu@email.com"
        />

        <Input
          label="Senha"
          type="password"
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          required
          disabled={isLoading}
          autoComplete="current-password"
          placeholder="Digite sua senha"
        />
      </div>

      <Button
        type="submit"
        loading={isLoading}
        disabled={isLoading}
        className={styles.submitButton}
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
