"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export interface EquipmentFormData {
  name: string
  modelNumber: string
  description: string
}

interface EquipmentFormProps {
  onSubmit: (data: EquipmentFormData) => Promise<void>
  onCancel: () => void
}

export function EquipmentForm({ onSubmit, onCancel }: EquipmentFormProps) {
  const [formData, setFormData] = React.useState<EquipmentFormData>({
    name: "",
    modelNumber: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setError("備品名は必須です")
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch {
      setError("保存に失敗しました。もう一度お試しください。")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">
          備品名 <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="例: ノートPC、プロジェクター"
          required
          autoComplete="off"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="modelNumber">型番</Label>
        <Input
          id="modelNumber"
          name="modelNumber"
          value={formData.modelNumber}
          onChange={handleChange}
          placeholder="例: ThinkPad X1 Carbon"
          autoComplete="off"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">説明</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="備品の詳細を入力（任意）"
          rows={3}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "登録中..." : "登録"}
        </Button>
      </div>
    </form>
  )
}
