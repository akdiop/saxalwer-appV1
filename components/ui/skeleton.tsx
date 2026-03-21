import * as React from "react";

type ClassValue = string | undefined | null | false;

function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
