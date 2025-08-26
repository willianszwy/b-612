import React, { forwardRef } from 'react';

const Textarea = forwardRef(({
  variant = 'default',
  size = 'md',
  placeholder = '',
  disabled = false,
  error = false,
  rows = 4,
  resize = 'vertical',
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

  const getResizeClass = () => {
    const resizeMap = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };
    
    return resizeMap[resize] || resizeMap.vertical;
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
    ${getResizeClass()}
    ${className}
  `.trim();

  return (
    <textarea
      ref={ref}
      className={combinedClassName}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;