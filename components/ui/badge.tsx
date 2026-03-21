import * as React from "react";

type ClassValue = string | undefined | null | false;
type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}

function badgeVariants(options?: { variant?: BadgeVariant }) {
  const variant = options?.variant ?? "default";
  const base =
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden";

  if (variant === "secondary") {
    return cn(base, "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90");
  }

  if (variant === "destructive") {
    return cn(
      base,
      "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
    );
  }

  if (variant === "outline") {
    return cn(base, "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground");
  }

  return cn(base, "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90");
}

type BadgeProps = React.ComponentProps<"span"> & {
  variant?: BadgeVariant;
  asChild?: boolean;
};

function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  if (asChild) {
    const child = React.Children.only(props.children) as React.ReactElement<any>;

    return React.cloneElement(child, {
      ...props,
      className: cn(badgeVariants({ variant }), child.props.className, className),
      "data-slot": "badge",
    });
  }

  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
