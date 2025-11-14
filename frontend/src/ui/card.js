import { forwardRef } from 'react';

const Card = forwardRef(({ 
  className = '', 
  title,
  description,
  header,
  footer,
  children,
  titleClassName = '',
  descriptionClassName = '',
  headerClassName = '',
  contentClassName = '',
  footerClassName = '',
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm ${className}`}
      {...props}
    >
      {/* Header Section */}
      {(title || description || header) && (
        <div className={`flex flex-col space-y-1.5 p-6 ${headerClassName}`}>
          {header ? (
            header
          ) : (
            <>
              {title && (
                <h3 className={`text-2xl font-semibold leading-none tracking-tight ${titleClassName}`}>
                  {title}
                </h3>
              )}
              {description && (
                <p className={`text-sm text-gray-600 ${descriptionClassName}`}>
                  {description}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Content Section */}
      {children && (
        <div className={`p-6 ${title || description || header ? 'pt-0' : ''} ${contentClassName}`}>
          {children}
        </div>
      )}

      {/* Footer Section */}
      {footer && (
        <div className={`flex items-center p-6 pt-0 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
});

Card.displayName = 'Card';

export { Card };
