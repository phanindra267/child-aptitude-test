import React, { useId } from 'react';

export function Input({
  label,
  type = 'text',
  placeholder,
  error,
  helperText,
  className = '',
  id,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        className={`form-input ${error ? 'form-error-state' : ''}`}
        aria-invalid={!!error}
        aria-describedby={
          error ? errorId : helperText ? helperId : undefined
        }
        {...props}
      />
      {helperText && !error && (
        <p id={helperId} className="form-helper">{helperText}</p>
      )}
      {error && (
        <p id={errorId} className="form-error">{error}</p>
      )}
    </div>
  );
}
