"use client"

import * as React from "react"
import Link from "next/link"
import { PlusIcon, Trash2Icon, QrCodeIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EquipmentForm, type EquipmentFormData } from "./EquipmentForm"

export interface Equipment {
  id: string
  name: string
  modelNumber: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
  activeLoan: {
    id: string
    borrowerName: string
    loanedAt: Date
  } | null
}

interface EquipmentClientProps {
  initialEquipment: Equipment[]
}

export function EquipmentClient({ initialEquipment }: EquipmentClientProps) {
  const [equipmentList, setEquipmentList] =
    React.useState<Equipment[]>(initialEquipment)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const handleCreate = async (data: EquipmentFormData) => {
    const response = await fetch("/api/equipment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        modelNumber: data.modelNumber || null,
        description: data.description || null,
      }),
    })

    if (!response.ok) throw new Error("登録に失敗しました")

    const created = await response.json()
    setEquipmentList((prev) => [{ ...created, activeLoan: null }, ...prev])
    setIsDialogOpen(false)
  }

  const handleDelete = async (item: Equipment) => {
    if (!confirm(`「${item.name}」を削除しますか？`)) return

    const response = await fetch(`/api/equipment/${item.id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      alert("削除に失敗しました")
      return
    }

    setEquipmentList((prev) => prev.filter((e) => e.id !== item.id))
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-muted/40">
      {/* ヘッダー */}
      <div className="border-b bg-card px-4 py-4">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <h1 className="text-lg font-semibold">備品管理</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            備品を登録
          </Button>
        </div>
      </div>

      {/* 備品一覧 */}
      <div className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-4xl">
          {equipmentList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">
                備品が登録されていません。「備品を登録」から追加してください。
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {equipmentList.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm leading-snug">
                          {item.name}
                        </CardTitle>
                        {item.modelNumber && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {item.modelNumber}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          asChild
                          aria-label="QRコード・詳細"
                        >
                          <Link href={`/equipment/${item.id}`}>
                            <QrCodeIcon />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleDelete(item)}
                          aria-label="削除"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2Icon />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-2">
                    {item.description && (
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    <div>
                      {item.activeLoan ? (
                        <Badge variant="destructive">
                          貸出中: {item.activeLoan.borrowerName}
                        </Badge>
                      ) : (
                        <Badge variant="success">返却済</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 備品登録ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onClose={() => setIsDialogOpen(false)}>
          <DialogHeader>
            <DialogTitle>備品を登録</DialogTitle>
          </DialogHeader>
          <EquipmentForm
            onSubmit={handleCreate}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
