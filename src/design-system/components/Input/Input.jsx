import React, { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  variant = 'default',
  size = 'md',
  placeholder = '',
  disabled = false,
  error = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  ...props
}, ref) => {
  const getVariantClasses = () => {
    const variants = {
      default: `
        bg-white/50 
        border border-white/70 
        focus:ring-pastel-purple focus:border-transparent
        placeholder-gray-500
        text-gray-700
      `,
      filled: `
        bg-pastel-purple/10 
        border border-purple-200/50 
        focus:ring-pastel-purple focus:border-purple-300
        placeholder-gray-500
        text-gray-700
      `,
      outline: `
        bg-transparent 
        border-2 border-pastel-purple 
        focus:ring-purple-300 focus:border-purple-400
        placeholder-gray-400
        text-gray-700
      `,
      ghost: `
        bg-transparent 
        border border-transparent 
        focus:ring-pastel-purple focus:border-pastel-purple
        placeholder-gray-400
        text-gray-700
      `,
    };
    
    if (error) {
      return `
        bg-red-50 
        border border-red-300 
        focus:ring-red-300 focus:border-red-400
        placeholder-red-400
        text-red-700
      `;
    }
    
    return variants[variant] || variants.default;
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-2 text-sm rounded-xl',
      md: 'px-4 py-3 text-base rounded-2xl',
      lg: 'px-5 py-4 text-lg rounded-2xl',
    };
    
    return sizes[size] || sizes.md;
  };

  const baseClasses = `
    w-full
    font-handwritten
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    disabled:bg-gray-100 disabled:border-gray-200
  `;

  const combinedClassName = `
    ${baseClasses}
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${className}
  `.trim();

  const inputElement = (
    <input
      ref={ref}
      type={type}
      className={combinedClassName}
      placeholder={placeholder}
      disabled={disabled}
      {...props}
    />
  );

  if (icon) {
    return (
      <div className="relative">
        {iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {inputElement}
        
        {iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    );
  }

  return inputElement;
});

Input.displayName = 'Input';

export default Input;