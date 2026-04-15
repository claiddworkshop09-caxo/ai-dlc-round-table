"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

// シンプルなモーダルダイアログ実装（@base-ui/react の Dialog は複雑なため独自実装）
interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  // ESCキーでダイアログを閉じる
  React.useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  if (!open) return null

  return <>{children}</>
}

function DialogTrigger({
  children,
  onClick,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  return (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  )
}

function DialogPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DialogOverlay({
  className,
  onClick,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
        className
      )}
      onClick={onClick}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  onClose,
  ...props
}: React.ComponentProps<"div"> & { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <DialogOverlay onClick={onClose} />
      <div
        data-slot="dialog-content"
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl bg-card p-6 shadow-xl ring-1 ring-foreground/10 max-h-[90vh] overflow-y-auto",
          className
        )}
        {...props}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="閉じる"
          >
            <XIcon className="size-4" />
          </button>
        )}
        {children}
      </div>
    </div>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("mb-4 space-y-1.5", className)}
      {...props}
    />
  )
}

function DialogTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-title"
      className={cn("text-base font-semibold leading-snug", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("mt-6 flex justify-end gap-2", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
}
