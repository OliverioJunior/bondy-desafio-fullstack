import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Input } from './index'

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render the input with label', () => {
      render(<Input label="Nome" />)

      expect(
        screen.getByRole('textbox', {
          name: /nome/i,
        })
      ).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<Input label="Email" placeholder="Digite seu email" />)

      expect(
        screen.getByPlaceholderText('Digite seu email')
      ).toBeInTheDocument()
    })

    it('should show asterisk when required=true', () => {
      render(<Input label="Senha" required />)

      expect(screen.getByText('*')).toBeInTheDocument()
      expect(screen.getByLabelText('obrigatório')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have unique ID generated automatically', () => {
      render(<Input label="Nome Completo" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('id', 'nome-completo-input')
    })

    it('should use custom ID when provided', () => {
      render(<Input label="Email" id="custom-email" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('id', 'custom-email')
    })

    it('should associate label with input correctly', () => {
      render(<Input label="telefone" />)

      const input = screen.getByRole('textbox')
      const label = screen.getByText('telefone')

      expect(label).toHaveAttribute('for', input.id)
    })

    it('should have aria-invalid=true when there is an error', () => {
      render(<Input label="Email" error="Email inválido" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should have aria-describedby when there is an error', () => {
      render(<Input label="Email" error="Email inválido" />)

      const input = screen.getByRole('textbox')
      const errorMessage = screen.getByRole('alert')

      expect(input).toHaveAttribute('aria-describedby', errorMessage.id)
    })

    it('should have aria-describedby when there is helper text', () => {
      render(<Input label="Senha" helperText="Mínimo 8 caracteres" />)

      const input = screen.getByRole('textbox')
      const helperText = screen.getByText('Mínimo 8 caracteres')

      expect(input).toHaveAttribute('aria-describedby', helperText.id)
    })
  })

  describe('Visual States', () => {
    it('should apply error class when error is provided', () => {
      const { container } = render(
        <Input label="Email" error="Email inválido" />
      )

      expect(container.firstChild).toHaveClass('error')
      expect(screen.getByRole('alert')).toHaveTextContent('Email inválido')
    })

    it('should apply disabled class when disabled=true', () => {
      const { container } = render(<Input label="Nome" disabled />)

      expect(container.firstChild).toHaveClass('disabled')
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should apply focused class when input is focused', async () => {
      const { container } = render(<Input label="Nome" />)
      const input = screen.getByRole('textbox')

      userEvent.click(input)

      expect(container.firstChild).toHaveClass('focused')
    })

    it('should apply hasValue class when input has value', () => {
      const { container } = render(<Input label="Nome" defaultValue="João" />)

      expect(container.firstChild).toHaveClass('hasValue')
    })
  })

  describe('Variants', () => {
    it('should apply default variant by default', () => {
      const { container } = render(<Input label="Nome" />)

      expect(container.firstChild).toHaveClass('variant-default')
    })

    it('should apply filled variant when specified', () => {
      const { container } = render(<Input label="Nome" variant="filled" />)

      expect(container.firstChild).toHaveClass('variant-filled')
    })

    it('should apply outlined variant when specified', () => {
      const { container } = render(<Input label="Nome" variant="outlined" />)

      expect(container.firstChild).toHaveClass('variant-outlined')
    })
  })

  describe('Interactions', () => {
    it('should call onFocus when input receives focus', async () => {
      const handleFocus = jest.fn()
      render(<Input label="Nome" onFocus={handleFocus} />)

      const input = screen.getByRole('textbox')
      userEvent.click(input)

      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('should call onBlur when input loses focus', async () => {
      const handleBlur = jest.fn()
      render(<Input label="Nome" onBlur={handleBlur} />)

      const input = screen.getByRole('textbox')
      userEvent.click(input)
      userEvent.tab()

      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('should call onChange when value changes', async () => {
      const handleChange = jest.fn()
      render(<Input label="Nome" onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      userEvent.type(input, 'João')

      expect(handleChange).toHaveBeenCalledTimes(4)
    })

    it('should update hasValue state when value changes', async () => {
      const { container } = render(<Input label="Nome" />)
      const input = screen.getByRole('textbox')

      userEvent.type(input, 'João')
      userEvent.tab()

      expect(container.firstChild).toHaveClass('hasValue')
    })
  })

  describe('Forwarded Ref', () => {
    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Input label="Nome" ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLInputElement)
      expect(ref.current).toBe(screen.getByRole('textbox'))
    })

    it('should allow focus via ref', () => {
      const ref = React.createRef<HTMLInputElement>()
      render(<Input label="Nome" ref={ref} />)

      ref.current?.focus()

      expect(ref.current).toHaveFocus()
    })
  })

  describe('Feedback Messages', () => {
    it('should show only error when error and helper text are present', () => {
      render(
        <Input
          label="Email"
          error="Email inválido"
          helperText="Digite um email válido"
        />
      )

      expect(screen.getByRole('alert')).toHaveTextContent('Email inválido')
      expect(
        screen.queryByText('Digite um email válido')
      ).not.toBeInTheDocument()
    })

    it('should show helper text when there is no error', () => {
      render(<Input label="Senha" helperText="Mínimo 8 caracteres" />)

      expect(screen.getByText('Mínimo 8 caracteres')).toBeInTheDocument()
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('Native Props', () => {
    it('should pass native props to the input', () => {
      render(
        <Input label="Email" type="email" maxLength={50} autoComplete="email" />
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('type', 'email')
      expect(input).toHaveAttribute('maxlength', '50')
      expect(input).toHaveAttribute('autocomplete', 'email')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <Input label="Nome" className="custom-class" />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })
})
