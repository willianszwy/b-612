import React from 'react';

const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  icon = null,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    const variants = {
      default: `
        bg-pastel-blue text-blue-800 
        border border-blue-200
      `,
      primary: `
        bg-pastel-purple text-purple-800 
        border border-purple-200
      `,
      secondary: `
        bg-pastel-mint text-green-800 
        border border-green-200
      `,
      accent: `
        bg-pastel-salmon text-orange-800 
        border border-orange-200
      `,
      warning: `
        bg-pastel-yellow text-yellow-800 
        border border-yellow-200
      `,
      success: `
        bg-green-100 text-green-800 
        border border-green-200
      `,
      error: `
        bg-red-100 text-red-800 
        border border-red-200
      `,
      neutral: `
        bg-gray-100 text-gray-700 
        border border-gray-200
      `,
      outline: `
        bg-transparent border-2 border-pastel-purple 
        text-purple-700
      `,
    };
    
    return variants[variant] || variants.default;
  };

  const getSizeClasses = () => {
    const sizes = {
      xs: 'px-1.5 py-0.5 text-xs rounded-md',
      sm: 'px-2 py-1 text-xs rounded-lg',
      md: 'px-2.5 py-1 text-sm rounded-full',
      lg: 'px-3 py-1.5 text-base rounded-full',
    };
    
    return sizes[size] || sizes.md;
  };

  const baseClasses = `
    inline-flex items-center gap-1
    font-handwritten font-medium
    whitespace-nowrap
    transition-all duration-200
  `;

  const combinedClassName = `
    ${baseClasses}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `.trim();

  return (
    <span className={combinedClassName} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;