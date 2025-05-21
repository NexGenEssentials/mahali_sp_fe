// Input.tsx
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="space-y-1">
      <label className="font-medium">{label}</label>
      <input ref={ref} {...props} className="w-full p-2 border rounded input" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
);

Input.displayName = "Input";

// Textarea.tsx
import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, ...props }, ref) => (
    <div className="space-y-1">
      <label className="font-medium">{label}</label>
      <textarea
        ref={ref}
        {...props}
        className="w-full p-2 border rounded input"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
);

Textarea.displayName = "Textarea";
