import * as React from "react";

import { cn } from "@shared/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "bg-background w-full h-[140px] rounded-full pr-50 pl-15 has-[>svg]:px-4 justify-start  gap-2.5  text-5xl font-bold placeholder:text-muted-foreground text-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Input };
