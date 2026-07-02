import React from 'react';

export function Button({
  className = '',
  variant = 'primary',
  size = 'default',
  disabled = false,
  as: Component = 'button',
  children,
  ...props
}) {
  const getVariantClass = () => {
    switch(variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'ghost': return 'btn-ghost';
      default: return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch(size) {
      case 'lg': return 'btn-lg';
      case 'sm': return 'btn-sm';
      case 'icon': return 'btn-icon';
      default: return '';
    }
  };

  return (
    <Component
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      disabled={Component === 'button' ? disabled : undefined}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </Component>
  );
}
