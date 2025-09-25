import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { LoginForm } from './index'

describe('LoginForm Component', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render all form elements', () => {
      render(<LoginForm />)

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /entrar/i })
      ).toBeInTheDocument()
    })

    it('should render with custom className', () => {
      render(<LoginForm className="custom-form" />)

      const form = screen.getByRole('form')
      expect(form).toHaveClass('custom-form')
    })
  })

  describe('Form Validation', () => {
    it('should show email required error when email is empty', async () => {
      const user = userEvent
      render(<LoginForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      user.click(submitButton)

      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show invalid email error when email format is wrong', async () => {
      const user = userEvent
      render(<LoginForm onSubmit={mockOnSubmit} />)

      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /entrar/i })

      user.type(emailInput, 'invalid-email')
      user.click(submitButton)

      expect(screen.getByText('Email inválido')).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show password required error when password is empty', async () => {
      const user = userEvent
      render(<LoginForm onSubmit={mockOnSubmit} />)

      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /entrar/i })

      user.type(emailInput, 'test@example.com')
      user.click(submitButton)

      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should clear field error when user starts typing', async () => {
      const user = userEvent
      render(<LoginForm onSubmit={mockOnSubmit} />)

      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /entrar/i })

      // Trigger validation error
      user.click(submitButton)
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument()

      // Start typing to clear error
      user.type(emailInput, 'test@example.com')
      expect(screen.queryByText('Email é obrigatório')).not.toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should call onSubmit with form data when form is valid', async () => {
      const user = userEvent
      render(<LoginForm onSubmit={mockOnSubmit} />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      const submitButton = screen.getByRole('button', { name: /entrar/i })

      user.type(emailInput, 'test@example.com')
      user.type(passwordInput, 'password123')
      user.click(submitButton)

      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    it('should prevent form submission when validation fails', async () => {
      const user = userEvent
      render(<LoginForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      user.click(submitButton)

      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('should show loading state during form submission', async () => {
      const user = userEvent
      const slowOnSubmit = jest.fn(() => {
        new Promise((resolver) =>
          setTimeout(() => {
            resolver
          }, 100)
        )
        return
      })

      render(<LoginForm onSubmit={slowOnSubmit} />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      const submitButton = screen.getByRole('button', { name: /entrar/i })

      user.type(emailInput, 'test@example.com')
      user.type(passwordInput, 'password123')
      user.click(submitButton)

      expect(screen.getByText(/entrando/i)).toBeInTheDocument()
      expect(submitButton).toBeDisabled()

      waitFor(() => {
        expect(screen.getByText(/entrar/i)).toBeInTheDocument()
      })
    })

    it('should handle async onSubmit errors gracefully', async () => {
      const user = userEvent
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      const errorOnSubmit = jest.fn(() =>
        Promise.reject(new Error('Login failed'))
      )

      render(<LoginForm onSubmit={errorOnSubmit} />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      const submitButton = screen.getByRole('button', { name: /entrar/i })

      user.type(emailInput, 'test@example.com')
      user.type(passwordInput, 'password123')
      user.click(submitButton)

      waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Erro no login:',
          expect.any(Error)
        )
        expect(screen.getByText(/entrar/i)).toBeInTheDocument()
      })

      consoleSpy.mockRestore()
    })
  })

  describe('Form Interactions', () => {
    it('should update form data when typing in inputs', async () => {
      const user = userEvent
      render(<LoginForm onSubmit={mockOnSubmit} />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)

      user.type(emailInput, 'user@test.com')
      user.type(passwordInput, 'mypassword')

      expect(emailInput).toHaveValue('user@test.com')
      expect(passwordInput).toHaveValue('mypassword')
    })

    it('should submit form when Enter is pressed in password field', async () => {
      const user = userEvent
      render(<LoginForm onSubmit={mockOnSubmit} />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)

      user.type(emailInput, 'test@example.com')
      user.type(passwordInput, 'password123')
      user.keyboard('{Enter}')

      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper form attributes', () => {
      render(<LoginForm />)

      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('noValidate')
    })

    it('should have proper input attributes', () => {
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)

      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('autoComplete', 'email')
      expect(emailInput).toHaveAttribute('placeholder', 'seu@email.com')

      expect(passwordInput).toHaveAttribute('type', 'password')
      expect(passwordInput).toHaveAttribute('autoComplete', 'current-password')
      expect(passwordInput).toHaveAttribute('placeholder', 'Digite sua senha')
    })

    it('should associate error messages with inputs', async () => {
      const user = userEvent
      render(<LoginForm onSubmit={mockOnSubmit} />)

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      user.click(submitButton)

      const emailInput = screen.getByLabelText(/email/i)
      const emailError = screen.getByText('Email é obrigatório')

      expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      expect(emailError).toHaveAttribute('role', 'alert')
    })
  })

  describe('Props Forwarding', () => {
    it('should forward additional props to form element', () => {
      render(<LoginForm data-testid="login-form" id="my-form" />)

      const form = screen.getByTestId('login-form')
      expect(form).toHaveAttribute('id', 'my-form')
    })

    it('should not call onSubmit when not provided', async () => {
      const user = userEvent
      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/senha/i)
      const submitButton = screen.getByRole('button', { name: /entrar/i })

      user.type(emailInput, 'test@example.com')
      user.type(passwordInput, 'password123')
      user.click(submitButton)

      expect(screen.getByText(/entrando\.\.\./i)).toBeInTheDocument()
    })
  })

  // describe('Edge Cases', () => {
  //   it('should validate email with various valid formats', async () => {
  //     const user = userEvent
  //     const validEmails = [
  //       'test@example.com',
  //       'user.name@domain.co.uk',
  //       'user+tag@example.org',
  //       'user123@test-domain.com',
  //     ]

  //     for (const email of validEmails) {
  //       render(<LoginForm onSubmit={mockOnSubmit} />)

  //       const emailInput = screen.getByLabelText(/email/i)
  //       const passwordInput = screen.getByLabelText(/senha/i)
  //       const submitButton = screen.getByRole('button', { name: /entrar/i })

  //       user.clear(emailInput)
  //       user.type(emailInput, email)
  //       user.type(passwordInput, 'password123')
  //       user.click(submitButton)

  //       expect(screen.queryByText('Email inválido')).not.toBeInTheDocument()
  //       expect(mockOnSubmit).toHaveBeenCalledWith({
  //         email,
  //         password: 'password123',
  //       })
  //       mockOnSubmit.mockClear()
  //     }
  //   })
  // })
})
