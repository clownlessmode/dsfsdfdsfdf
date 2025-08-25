import * as React from "react";

import { cn } from "@shared/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-secondary text-foreground shadow-xs hover:bg-secondary/80",
        "rounded-full px-10 pb-6 pt-5.5 has-[>svg]:px-4 font-black text-4xl tracking-[-2px]",
        className
      )}
      {...props}
    />
  );
}

export { Input };
