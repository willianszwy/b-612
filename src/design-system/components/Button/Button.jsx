import React from 'react';

const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const getVariantClasses = () => {
    const variants = {
      primary: `
        bg-pastel-purple hover:bg-purple-300 
        text-purple-800 
        shadow-md hover:shadow-lg
        border border-purple-200/50
        disabled:bg-purple-200 disabled:text-purple-400
      `,
      secondary: `
        bg-pastel-mint hover:bg-green-300 
        text-green-800 
        shadow-md hover:shadow-lg
        border border-green-200/50
        disabled:bg-green-200 disabled:text-green-400
      `,
      accent: `
        bg-pastel-salmon hover:bg-orange-300 
        text-orange-800 
        shadow-md hover:shadow-lg
        border border-orange-200/50
        disabled:bg-orange-200 disabled:text-orange-400
      `,
      outline: `
        bg-transparent border-2 border-pastel-purple 
        text-purple-700 hover:bg-pastel-purple/20
        shadow-sm hover:shadow-md
        disabled:border-purple-200 disabled:text-purple-300
      `,
      ghost: `
        bg-transparent text-gray-700 
        hover:bg-white/50 hover:shadow-sm
        disabled:text-gray-400
      `,
      danger: `
        bg-red-500 hover:bg-red-600 
        text-white 
        shadow-md hover:shadow-lg
        border border-red-400/50
        disabled:bg-red-300 disabled:text-red-100
      `,
    };
    
    return variants[variant] || variants.primary;
  };

  const getSizeClasses = () => {
    const sizes = {
      xs: 'py-1 px-2 text-xs rounded-lg',
      sm: 'py-2 px-4 text-sm rounded-xl',
      md: 'py-3 px-6 text-base rounded-2xl',
      lg: 'py-4 px-8 text-lg rounded-2xl',
      xl: 'py-5 px-10 text-xl rounded-2xl',
    };
    
    return sizes[size] || sizes.md;
  };

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-handwritten font-semibold
    transition-all duration-300
    transform hover:-translate-y-1
    focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:transform-none disabled:hover:translate-y-0
    disabled:shadow-none disabled:hover:shadow-none
    relative overflow-hidden
  `;

  const combinedClassName = `
    ${baseClasses}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${loading ? 'pointer-events-none' : ''}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={combinedClassName}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Conteúdo do botão */}
      <div className={`flex items-center gap-2 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        
        {children}
        
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </div>
    </button>
  );
};

export default Button;