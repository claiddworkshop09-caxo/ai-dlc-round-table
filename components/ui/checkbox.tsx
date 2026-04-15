"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// ネイティブ input[type=checkbox] をラップしたシンプルな実装
interface CheckboxProps extends Omit<React.ComponentProps<"input">, "type"> {
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({ className, onCheckedChange, onChange, ...props }: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    onCheckedChange?.(e.target.checked)
  }

  return (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        data-slot="checkbox"
        className={cn(
          "peer size-4 shrink-0 rounded-[4px] border border-input bg-transparent transition-colors outline-none cursor-pointer focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 checked:border-primary checked:bg-primary appearance-none",
          className
        )}
        onChange={handleChange}
        {...props}
      />
      <CheckIcon className="pointer-events-none absolute left-0.5 top-0.5 size-3 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-opacity" />
    </div>
  )
}

export { Checkbox }
