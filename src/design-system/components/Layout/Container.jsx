import React from 'react';

const Container = ({
  variant = 'default',
  size = 'default',
  padding = 'md',
  centered = false,
  children,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    const variants = {
      default: '',
      glass: `
        bg-white/30 backdrop-blur-md 
        border border-white/40 rounded-2xl
        shadow-lg shadow-white/25
      `,
      card: `
        bg-white/70 backdrop-blur-sm 
        border border-white/50 rounded-2xl
        shadow-lg
      `,
      gradient: `
        bg-gradient-to-br from-white/80 to-white/60 
        backdrop-blur-sm border border-white/40 rounded-2xl
        shadow-lg
      `,
    };
    
    return variants[variant] || variants.default;
  };

  const getSizeClasses = () => {
    const sizes = {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl',
      full: 'max-w-full',
      default: 'max-w-md', // Para PWA mobile-first
    };
    
    return sizes[size] || sizes.default;
  };

  const getPaddingClasses = () => {
    const paddings = {
      none: 'p-0',
      xs: 'p-2',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    };
    
    return variant === 'default' ? '' : paddings[padding] || paddings.md;
  };

  const baseClasses = `
    w-full
    ${centered ? 'mx-auto' : ''}
  `;

  const combinedClassName = `
    ${baseClasses}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${getPaddingClasses()}
    ${className}
  `.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

// Componente para seções principais
const Section = ({
  variant = 'default',
  spacing = 'md',
  children,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    const variants = {
      default: '',
      header: 'bg-white/30 backdrop-blur-md border-b border-white/40',
      footer: 'bg-white/30 backdrop-blur-md border-t border-white/40',
      hero: 'bg-gradient-to-br from-pastel-purple/20 to-pastel-blue/20',
    };
    
    return variants[variant] || variants.default;
  };

  const getSpacingClasses = () => {
    const spacings = {
      none: 'py-0',
      xs: 'py-2',
      sm: 'py-4',
      md: 'py-6',
      lg: 'py-8',
      xl: 'py-12',
      '2xl': 'py-16',
    };
    
    return spacings[spacing] || spacings.md;
  };

  const combinedClassName = `
    ${getVariantClasses()}
    ${getSpacingClasses()}
    ${className}
  `.trim();

  return (
    <section className={combinedClassName} {...props}>
      {children}
    </section>
  );
};

Container.Section = Section;

export default Container;