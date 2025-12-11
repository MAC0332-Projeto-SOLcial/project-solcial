import React from 'react';
import { Label } from './label';

const Textarea = React.forwardRef(({ className = '', label, labelClassName = '', ...props }, ref) => {
  const textareaElement = (
    <textarea
      className={`flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${className}`}
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
        {textareaElement}
      </div>
    );
  }

  return textareaElement;
});

Textarea.displayName = 'Textarea';

export { Textarea };



