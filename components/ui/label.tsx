"use client";

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

type ClassValue = string | undefined | null | false;

function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
