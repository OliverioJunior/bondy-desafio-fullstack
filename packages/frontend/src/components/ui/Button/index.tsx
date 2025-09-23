import React, { ComponentProps, FC, forwardRef } from 'react'
import styles from './Button.module.css'

interface IButton extends ComponentProps<'button'> {
  variant?: 'primary' | 'outline' | 'destructive'
  loading?: boolean
  leftIcon?: React.ReactNode
}

export const Button: FC<IButton> = forwardRef<HTMLButtonElement, IButton>(
  (
    {
      variant = 'primary',
      loading = false,
      leftIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading
    const containerClass = [
      styles.container,
      styles[`variant-${variant}`],
      disabled && styles.disabled,
      className,
    ]
      .filter(Boolean)
      .join(' ')
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={containerClass}
        {...props}
      >
        {loading && <span className={styles.spinner} />}
        {leftIcon && !loading && (
          <span className={styles.leftIcon}>{leftIcon}</span>
        )}
        <span>{children}</span>
      </button>
    )
  }
)
Button.displayName = 'Button'
