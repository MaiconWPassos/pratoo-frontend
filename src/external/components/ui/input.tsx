import * as React from "react";

import { cn } from "@/domain/lib/utils";
import { Eye, EyeClosed } from "lucide-react";
import constants from "@/domain/styles/constants";

interface InputProps extends React.ComponentProps<"input"> {
  hasPassword?: boolean;
}

function Input({ className, type, hasPassword, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div className="relative">
      <input
        type={hasPassword ? (showPassword ? "text" : "password") : type}
        data-slot="input"
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground aria-invalid:outline-destructive/60 aria-invalid:ring-destructive/20 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/50 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 aria-invalid:outline-destructive/60 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/40 aria-invalid:ring-destructive/20 aria-invalid:border-destructive/60 dark:aria-invalid:border-destructive flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-4 focus-visible:outline-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-[3px] aria-invalid:focus-visible:outline-none md:text-sm dark:aria-invalid:focus-visible:ring-4",
          className
        )}
        {...props}
      />

      {hasPassword && (
        <button
          className="absolute right-2 top-2 text-muted-foreground"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <Eye size={constants.iconSize} />
          ) : (
            <EyeClosed size={constants.iconSize} />
          )}
        </button>
      )}
    </div>
  );
}

export { Input };
