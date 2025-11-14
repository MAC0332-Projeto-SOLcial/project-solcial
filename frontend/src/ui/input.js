import { forwardRef } from 'react';
import { Label } from './label';

const Input = forwardRef(({ className = '', type = 'text', label, labelClassName = '', error, ...props }, ref) => {
  
  const errorClasses = error ? 'border-red-500 focus-visible:ring-red-500' : '';
  
  const inputElement = (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errorClasses} ${className}`}
      ref={ref}
      {...props}
    />
  );

  if (label) {
    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className={labelClassName}>
          {label}
        </Label>
        {inputElement}
      </div>
    );
  }

  return inputElement;
});

Input.displayName = 'Input';

export { Input };