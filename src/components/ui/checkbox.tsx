"use client"

import * as React from "react"
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  checked,
  onCheckedChange,
  ...props
}: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked}
      onCheckedChange={onCheckedChange}
      render={
        <span
          className={cn(
            "peer inline-flex size-4 shrink-0 items-center justify-center rounded border border-champagne-deep bg-white text-navy-deep transition-colors outline-none focus-visible:ring-2 focus-visible:ring-gold/40 focus-visible:outline-none data-checked:border-gold data-checked:bg-gold data-checked:text-navy-deep data-disabled:pointer-events-none data-disabled:opacity-50",
            className
          )}
        />
      }
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center">
        <CheckIcon className="size-3" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
