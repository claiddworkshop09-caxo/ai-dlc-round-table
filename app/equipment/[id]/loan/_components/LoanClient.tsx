"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeftIcon, CheckCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface Equipment {
  id: string
  name: string
  modelNumber: string | null
  description: string | null
}

interface Loan {
  id: string
  equipmentId: string
  borrowerName: string
  loanedAt: Date
  returnedAt: Date | null
}

interface LoanClientProps {
  equipment: Equipment
  activeLoan: Loan | null
}

export function LoanClient({ equipment, activeLoan }: LoanClientProps) {
  const [currentLoan, setCurrentLoan] = React.useState<Loan | null>(activeLoan)
  const [borrowerName, setBorrowerName] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)

  const handleLoan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!borrowerName.trim()) {
      setError("借用者名を入力してください")
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/equipment/${equipment.id}/loan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ borrowerName: borrowerName.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "貸し出しに失敗しました")
      }

      const loan = await response.json()
      setCurrentLoan(loan)
      setBorrowerName("")
      setSuccessMessage(`「${equipment.name}」を ${borrowerName.trim()} さんに貸し出しました`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "貸し出しに失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReturn = async () => {
    if (!currentLoan) return
    if (!confirm(`「${equipment.name}」を返却しますか？`)) return

    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch(
        `/api/equipment/${equipment.id}/loan/${currentLoan.id}`,
        { method: "PATCH" }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error ?? "返却に失敗しました")
      }

      setSuccessMessage(`「${equipment.name}」が返却されました`)
      setCurrentLoan(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "返却に失敗しました")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-muted/40">
      {/* ヘッダー */}
      <div className="border-b bg-card px-4 py-4">
        <div className="mx-auto max-w-md flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href={`/equipment/${equipment.id}`} aria-label="詳細へ戻る">
              <ArrowLeftIcon />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{equipment.name}</h1>
            {equipment.modelNumber && (
              <p className="text-xs text-muted-foreground">
                {equipment.modelNumber}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-md space-y-6">
          {/* 成功メッセージ */}
          {successMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
              <CheckCircleIcon className="size-4 shrink-0" />
              {successMessage}
            </div>
          )}

          {/* 現在の状態 */}
          <div className="rounded-lg bg-card border p-4">
            <p className="text-sm font-medium mb-2">現在の状態</p>
            {currentLoan ? (
              <div className="space-y-2">
                <Badge variant="destructive">貸出中</Badge>
                <p className="text-sm">
                  借用者: <span className="font-medium">{currentLoan.borrowerName}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  貸出日時: {new Date(currentLoan.loanedAt).toLocaleString("ja-JP")}
                </p>
              </div>
            ) : (
              <Badge variant="success">返却済・貸出可能</Badge>
            )}
          </div>

          {/* エラー */}
          {error && (
            <p className="text-sm text-destructive rounded-lg bg-destructive/10 px-4 py-3">
              {error}
            </p>
          )}

          {/* 操作フォーム */}
          {currentLoan ? (
            /* 返却 */
            <div className="rounded-lg bg-card border p-4 space-y-4">
              <h2 className="font-semibold">返却する</h2>
              <p className="text-sm text-muted-foreground">
                {currentLoan.borrowerName} さんが借用中の備品を返却します。
              </p>
              <Button
                onClick={handleReturn}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "処理中..." : "返却する"}
              </Button>
            </div>
          ) : (
            /* 貸し出し */
            <div className="rounded-lg bg-card border p-4 space-y-4">
              <h2 className="font-semibold">貸し出しする</h2>
              <form onSubmit={handleLoan} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="borrowerName">
                    借用者名 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="borrowerName"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    placeholder="借用者の名前を入力"
                    required
                    autoComplete="off"
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "処理中..." : "貸し出しする"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
