import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Button } from './index'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render the button with children', () => {
      render(<Button>Clique aqui</Button>)

      expect(
        screen.getByRole('button', {
          name: /clique aqui/i,
        })
      ).toBeInTheDocument()
    })

    it('should render with leftIcon when provided', () => {
      const Icon = () => <span data-testid="test-icon">🔍</span>
      render(<Button leftIcon={<Icon />}>Pesquisar</Button>)

      expect(screen.getByTestId('test-icon')).toBeInTheDocument()
      expect(screen.getByRole('button')).toHaveTextContent('Pesquisar')
    })

    it('should show spinner when loading=true', () => {
      render(<Button loading>Carregando</Button>)

      expect(document.querySelector('.spinner')).toBeInTheDocument()
    })

    it('should hide leftIcon when loading=true', () => {
      const Icon = () => <span data-testid="test-icon">🔍</span>
      render(
        <Button leftIcon={<Icon />} loading>
          Carregando
        </Button>
      )

      expect(screen.queryByTestId('test-icon')).not.toBeInTheDocument()
      expect(document.querySelector('.spinner')).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('should apply primary variant by default', () => {
      render(<Button>Botão</Button>)

      expect(screen.getByRole('button')).toHaveClass('variant-primary')
    })

    it('should apply outline variant when specified', () => {
      render(<Button variant="outline">Botão</Button>)

      expect(screen.getByRole('button')).toHaveClass('variant-outline')
    })

    it('should apply destructive variant when specified', () => {
      render(<Button variant="destructive">Botão</Button>)

      expect(screen.getByRole('button')).toHaveClass('variant-destructive')
    })
  })

  describe('States', () => {
    it('should be disabled when disabled=true', () => {
      render(<Button disabled>Botão</Button>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled')
    })

    it('should be disabled when loading=true', () => {
      render(<Button loading>Botão</Button>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should be disabled when both disabled and loading are true', () => {
      render(
        <Button disabled loading>
          Botão
        </Button>
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled')
    })

    it('should apply container class', () => {
      render(<Button>Botão</Button>)

      expect(screen.getByRole('button')).toHaveClass('container')
    })
  })

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Clique</Button>)

      const button = screen.getByRole('button')
      userEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not call onClick when disabled', async () => {
      const handleClick = jest.fn()
      render(
        <Button onClick={handleClick} disabled>
          Clique
        </Button>
      )

      const button = screen.getByRole('button')
      userEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    it('should not call onClick when loading', async () => {
      const handleClick = jest.fn()
      render(
        <Button onClick={handleClick} loading>
          Clique
        </Button>
      )

      const button = screen.getByRole('button')
      userEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Forwarded Ref', () => {
    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<Button ref={ref}>Botão</Button>)

      expect(ref.current).toBeInstanceOf(HTMLButtonElement)
      expect(ref.current).toBe(screen.getByRole('button'))
    })

    it('should allow focus via ref', () => {
      const ref = React.createRef<HTMLButtonElement>()
      render(<Button ref={ref}>Botão</Button>)

      ref.current?.focus()

      expect(ref.current).toHaveFocus()
    })
  })

  describe('Native Props', () => {
    it('should pass native props to the button', () => {
      render(
        <Button type="submit" form="test-form" tabIndex={0}>
          Enviar
        </Button>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('form', 'test-form')
      expect(button).toHaveAttribute('tabindex', '0')
    })

    it('should apply custom className', () => {
      render(<Button className="custom-class">Botão</Button>)

      expect(screen.getByRole('button')).toHaveClass('custom-class')
    })

    it('should merge custom className with default classes', () => {
      render(
        <Button className="custom-class" variant="outline">
          Botão
        </Button>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('container')
      expect(button).toHaveClass('variant-outline')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('Display Name', () => {
    it('should have correct displayName', () => {
      expect(Button.displayName).toBe('Button')
    })
  })

  describe('CSS Classes', () => {
    it('should apply all relevant CSS classes', () => {
      render(
        <Button variant="destructive" disabled className="extra-class">
          Botão
        </Button>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('container')
      expect(button).toHaveClass('variant-destructive')
      expect(button).toHaveClass('disabled')
      expect(button).toHaveClass('extra-class')
    })

    it('should filter out falsy classes', () => {
      render(<Button className="">Botão</Button>)

      const button = screen.getByRole('button')
      expect(button.className).toBe('container variant-primary')
    })
  })
})
