import React from 'react';

const Card = ({
  variant = 'default',
  children,
  className = '',
  padding = 'md',
  hover = false,
  blur = true,
  shadow = 'md',
  onClick,
  ...props
}) => {
  const getVariantClasses = () => {
    const variants = {
      default: `
        bg-white/70 
        border border-white/50
      `,
      glass: `
        bg-white/60 
        border border-white/30
      `,
      solid: `
        bg-white 
        border border-gray-200
      `,
      gradient: `
        bg-gradient-to-br from-white/80 to-white/60 
        border border-white/40
      `,
      accent: `
        bg-pastel-purple/20 
        border border-purple-200/50
      `,
    };
    
    return variants[variant] || variants.default;
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
    
    return paddings[padding] || paddings.md;
  };

  const getShadowClasses = () => {
    const shadows = {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-lg',
      lg: 'shadow-xl',
      glass: 'shadow-lg shadow-white/25',
    };
    
    return shadows[shadow] || shadows.md;
  };

  const baseClasses = `
    rounded-2xl
    transition-all duration-300
    ${blur ? 'backdrop-blur-sm' : ''}
    ${hover ? 'hover:shadow-xl hover:transform hover:scale-[1.02]' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

  const combinedClassName = `
    ${baseClasses}
    ${getVariantClasses()}
    ${getPaddingClasses()}
    ${getShadowClasses()}
    ${className}
  `.trim();

  return (
    <div
      className={combinedClassName}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Componentes relacionados para estrutura de card
const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-lg font-cute text-gray-800 ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm font-handwritten text-gray-600 ${className}`} {...props}>
    {children}
  </p>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`mt-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;