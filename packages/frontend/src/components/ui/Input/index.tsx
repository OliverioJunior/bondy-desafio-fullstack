import React, { ComponentProps, FC, forwardRef, useState } from 'react'
import styles from './Input.module.css'
interface IInput extends ComponentProps<'input'> {
  label: string
  error?: string
  helperText?: string
  variant?: 'default' | 'filled' | 'outlined'
}

export const Input: FC<IInput> = forwardRef<HTMLInputElement, IInput>(
  (
    {
      label,
      required,
      error,
      helperText,
      variant = 'default',
      size = 'medium',
      onFocus,
      onBlur,
      disabled,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(
      !!props.value || !!props.defaultValue
    )
    const inputId = id || `${label.toLowerCase().replace(/\s+/g, '-')}-input`
    const containerClass = [
      styles.container,
      styles[`variant-${variant}`],
      isFocused && styles.focused,
      error && styles.error,
      disabled && styles.disabled,
      hasValue && styles.hasValue,
      className,
    ]
      .filter(Boolean)
      .join(' ')
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      onFocus?.(e)
    }
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
      onBlur?.(e)
    }
    return (
      <div className={containerClass}>
        <label className={styles.label} htmlFor={`${inputId}`}>
          {label}
          {required && (
            <span aria-label="obrigatório" className={styles.required}>
              *
            </span>
          )}
        </label>
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />
        </div>
        {error && (
          <span
            id={`${inputId}-error`}
            className={styles.errorMessage}
            role="alert"
            aria-live="polite"
          >
            {error}
          </span>
        )}
        {helperText && !error && (
          <span id={`${inputId}-helper`} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    )
  }
)
