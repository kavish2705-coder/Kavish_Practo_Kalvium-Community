import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Base styles
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-600 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer";
    
    // Variant styles using pale olive secondary palette
    const variants = {
      default: "bg-secondary-600 text-white hover:bg-secondary-700 shadow-sm shadow-secondary-600/20 active:scale-[0.98]",
      secondary: "bg-secondary-100 dark:bg-secondary-900/90 text-secondary-800 dark:text-secondary-200 hover:bg-secondary-200 dark:hover:bg-secondary-800 active:scale-[0.98]",
      outline: "border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 hover:bg-secondary-50 dark:hover:bg-slate-700 hover:border-secondary-400 text-slate-800 dark:text-slate-100",
      ghost: "hover:bg-secondary-100/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white text-slate-700 dark:text-slate-200",
      link: "text-secondary-700 dark:text-secondary-400 underline-offset-4 hover:underline",
    };
    
    // Size styles
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3 text-xs",
      lg: "h-12 rounded-xl px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <Comp
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
