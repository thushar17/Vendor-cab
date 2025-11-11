import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary">{icon}</span>}
        <input
          type={type}
          className={`w-full bg-neutral-800/50 border border-border rounded-md py-2 pr-4 text-text focus:outline-none focus:ring-2 focus:ring-primary ${icon ? 'pl-10' : 'pl-4'} ${className}`}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
