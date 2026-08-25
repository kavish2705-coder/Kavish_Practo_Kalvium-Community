import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, maxLength, value, ...props }, ref) => {
    const charCount = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          {label && (
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              {label}
            </label>
          )}
          {maxLength && (
            <span className="text-[11px] text-slate-400">
              {charCount}/{maxLength}
            </span>
          )}
        </div>
        <textarea
          className={cn(
            "flex min-h-[90px] w-full rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary-600 focus:border-secondary-600 transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-sm resize-y",
            error && "border-red-500 ring-1 ring-red-500",
            className
          )}
          ref={ref}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {error && (
          <p className="text-xs font-medium text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
