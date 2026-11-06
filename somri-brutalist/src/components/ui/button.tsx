import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 font-medium uppercase tracking-[0.06em] whitespace-nowrap select-none outline-none transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
  {
    variants: {
      variant: {
        default:
          "border-ink bg-ink text-paper shadow-[4px_4px_0_0_#6d28d9] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#6d28d9] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        accent:
          "border-ink bg-accent text-white shadow-[4px_4px_0_0_#141414] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#141414] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        outline:
          "border-ink bg-paper text-ink shadow-[4px_4px_0_0_#141414] hover:bg-ink hover:text-paper hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#141414] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        ghost: "border-transparent bg-transparent text-ink hover:bg-paper-2",
        paper:
          "border-paper bg-paper text-ink shadow-[4px_4px_0_0_#141414] hover:bg-accent hover:text-white hover:border-accent hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_#141414]",
      },
      size: {
        sm: "h-8 px-3 text-[11px]",
        default: "h-11 px-5 text-xs",
        lg: "h-13 px-7 text-sm",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { Button, buttonVariants }
