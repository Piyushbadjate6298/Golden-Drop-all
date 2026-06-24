import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-component border border-surface-border bg-surface-white px-3 text-sm outline-none transition focus:border-gold-primary focus:shadow-focus",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-component border border-surface-border bg-surface-white px-3 py-3 text-sm outline-none transition focus:border-gold-primary focus:shadow-focus",
        className
      )}
      {...props}
    />
  );
}
