import React from 'react';

const Spinner = ({
  size = 'md',
  variant = 'primary',
  speed = 'normal',
  className = '',
  ...props
}) => {
  const getSizeClasses = () => {
    const sizes = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
      '2xl': 'w-16 h-16',
    };
    
    return sizes[size] || sizes.md;
  };

  const getVariantClasses = () => {
    const variants = {
      primary: 'border-purple-200 border-t-purple-600',
      secondary: 'border-green-200 border-t-green-600',
      accent: 'border-orange-200 border-t-orange-600',
      white: 'border-white/30 border-t-white',
      gray: 'border-gray-200 border-t-gray-600',
    };
    
    return variants[variant] || variants.primary;
  };

  const getSpeedClasses = () => {
    const speeds = {
      slow: 'animate-spin duration-1000',
      normal: 'animate-spin',
      fast: 'animate-spin duration-500',
    };
    
    return speeds[speed] || speeds.normal;
  };

  const combinedClassName = `
    ${getSizeClasses()}
    ${getVariantClasses()}
    ${getSpeedClasses()}
    border-2 border-solid rounded-full
    ${className}
  `.trim();

  return (
    <div
      className={combinedClassName}
      role="status"
      aria-label="Carregando..."
      {...props}
    />
  );
};

// Componente para loading com overlay
const LoadingOverlay = ({
  show = false,
  message = 'Carregando...',
  spinner = true,
  size = 'md',
  variant = 'primary',
  blur = true,
  className = '',
}) => {
  if (!show) return null;

  return (
    <div className={`
      fixed inset-0 
      ${blur ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/30'}
      flex items-center justify-center
      z-[9998]
      animate-fade-in
      ${className}
    `}>
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col items-center gap-4">
          {spinner && (
            <Spinner size={size} variant={variant} />
          )}
          
          {message && (
            <p className="font-handwritten text-gray-700 text-center">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Componente para loading inline
const LoadingContent = ({
  loading = false,
  children,
  fallback = null,
  size = 'md',
  variant = 'primary',
  message = '',
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 py-8 ${className}`}>
        <Spinner size={size} variant={variant} />
        {message && (
          <p className="font-handwritten text-gray-600 text-sm">
            {message}
          </p>
        )}
        {fallback}
      </div>
    );
  }

  return children;
};

Spinner.Overlay = LoadingOverlay;
Spinner.Content = LoadingContent;

export default Spinner;