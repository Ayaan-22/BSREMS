import { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "focus-ring group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full font-semibold transition-all duration-300 active:scale-[.97] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-accent-soft to-accent text-ink-950 shadow-[0_8px_30px_-8px_rgba(45,212,191,.7),inset_0_1px_0_rgba(255,255,255,.5)] hover:shadow-[0_12px_40px_-6px_rgba(45,212,191,.9),inset_0_1px_0_rgba(255,255,255,.6)] hover:-translate-y-0.5",
        gold: "bg-gradient-to-b from-gold-soft to-gold text-ink-950 shadow-[0_8px_30px_-8px_rgba(242,196,109,.7),inset_0_1px_0_rgba(255,255,255,.5)] hover:-translate-y-0.5",
        secondary: "border border-white/10 bg-white/[.06] text-white backdrop-blur hover:border-white/20 hover:bg-white/[.1]",
        ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
        danger: "border border-error/30 bg-error/10 text-red-200 hover:bg-error/20"
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-14 px-7 text-base"
      }
    },
    defaultVariants: { variant: "primary", size: "md" }
  }
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export function Button({ className, variant, size, children, ...props }: ButtonProps) {
  const shiny = variant === undefined || variant === "primary" || variant === "gold";
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {shiny && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 transition-all duration-700 group-hover/btn:left-[120%] group-hover/btn:opacity-100"
        />
      )}
      {children}
    </button>
  );
}
