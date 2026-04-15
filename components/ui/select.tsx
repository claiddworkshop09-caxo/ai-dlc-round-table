"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// ネイティブ <select> をラップしたシンプルな実装
function Select({
  className,
  children,
  ...props
}: React.ComponentProps<"select">) {
  return (
    <div data-slot="select" className="relative w-full">
      <select
        className={cn(
          "h-8 w-full appearance-none rounded-lg border border-input bg-transparent px-2.5 py-1 pr-8 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

function SelectOption({
  className,
  ...props
}: React.ComponentProps<"option">) {
  return <option className={cn(className)} {...props} />
}

export { Select, SelectOption }
