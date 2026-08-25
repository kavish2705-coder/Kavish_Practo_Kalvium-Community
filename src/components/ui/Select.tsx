import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-bold uppercase tracking-wider text-white">
            {label}
          </label>
        )}
        <select
          className={cn(
            "flex h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all disabled:cursor-not-allowed disabled:opacity-50 shadow-sm cursor-pointer font-medium",
            error && "border-red-500 ring-1 ring-red-500",
            className
          )}
          ref={ref}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-800 text-white font-medium">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs font-semibold text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
