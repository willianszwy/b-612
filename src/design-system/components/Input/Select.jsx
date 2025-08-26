import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({
  variant = 'default',
  size = 'md',
  placeholder = 'Selecione uma opção...',
  disabled = false,
  error = false,
  children,
  className = '',
  ...props
}, ref) => {
  const getVariantClasses = () => {
    const variants = {
      default: `
        bg-white/50 
        border border-white/70 
        focus:ring-pastel-purple focus:border-transparent
        text-gray-700
      `,
      filled: `
        bg-pastel-purple/10 
        border border-purple-200/50 
        focus:ring-pastel-purple focus:border-purple-300
        text-gray-700
      `,
      outline: `
        bg-transparent 
        border-2 border-pastel-purple 
        focus:ring-purple-300 focus:border-purple-400
        text-gray-700
      `,
      ghost: `
        bg-transparent 
        border border-transparent 
        focus:ring-pastel-purple focus:border-pastel-purple
        text-gray-700
      `,
    };
    
    if (error) {
      return `
        bg-red-50 
        border border-red-300 
        focus:ring-red-300 focus:border-red-400
        text-red-700
      `;
    }
    
    return variants[variant] || variants.default;
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-2 pr-8 text-sm rounded-xl',
      md: 'px-4 py-3 pr-10 text-base rounded-2xl',
      lg: 'px-5 py-4 pr-12 text-lg rounded-2xl',
    };
    
    return sizes[size] || sizes.md;
  };

  const baseClasses = `
    w-full
    font-handwritten
    appearance-none
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:bg-gray-100 disabled:border-gray-200
  `;

  const combinedClassName = `
    ${baseClasses}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `.trim();

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  const iconPosition = size === 'sm' ? 'right-2' : size === 'lg' ? 'right-4' : 'right-3';

  return (
    <div className="relative">
      <select
        ref={ref}
        className={combinedClassName}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      
      {/* Ícone de seta */}
      <div className={`absolute ${iconPosition} top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400`}>
        <ChevronDown size={iconSize} />
      </div>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;