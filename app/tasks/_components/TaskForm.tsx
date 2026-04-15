"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectOption } from "@/components/ui/select"

// タスクの型定義
export interface TaskFormData {
  title: string
  description: string
  status: string
  priority: string
  dueDate: string
  projectId: string
}

interface Project {
  id: string
  name: string
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData>
  projects: Project[]
  onSubmit: (data: TaskFormData) => Promise<void>
  onCancel: () => void
  isEdit?: boolean
}

export function TaskForm({
  initialData,
  projects,
  onSubmit,
  onCancel,
  isEdit = false,
}: TaskFormProps) {
  const [formData, setFormData] = React.useState<TaskFormData>({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    status: initialData?.status ?? "todo",
    priority: initialData?.priority ?? "medium",
    dueDate: initialData?.dueDate ?? "",
    projectId: initialData?.projectId ?? "",
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setError("タイトルは必須です")
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
      {/* タイトル */}
      <div className="space-y-1.5">
        <Label htmlFor="title">
          タイトル <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="タスクのタイトルを入力"
          required
          autoComplete="off"
        />
      </div>

      {/* 説明 */}
      <div className="space-y-1.5">
        <Label htmlFor="description">説明</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="タスクの詳細を入力（任意）"
          rows={3}
        />
      </div>

      {/* ステータス・優先度 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="status">ステータス</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <SelectOption value="todo">未着手</SelectOption>
            <SelectOption value="in_progress">進行中</SelectOption>
            <SelectOption value="done">完了</SelectOption>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="priority">優先度</Label>
          <Select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <SelectOption value="high">高</SelectOption>
            <SelectOption value="medium">中</SelectOption>
            <SelectOption value="low">低</SelectOption>
          </Select>
        </div>
      </div>

      {/* 締め切り日 */}
      <div className="space-y-1.5">
        <Label htmlFor="dueDate">締め切り日</Label>
        <Input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
        />
      </div>

      {/* プロジェクト */}
      {projects.length > 0 && (
        <div className="space-y-1.5">
          <Label htmlFor="projectId">プロジェクト</Label>
          <Select
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
          >
            <SelectOption value="">プロジェクトなし</SelectOption>
            {projects.map((p) => (
              <SelectOption key={p.id} value={p.id}>
                {p.name}
              </SelectOption>
            ))}
          </Select>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* ボタン */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "保存中..." : isEdit ? "更新" : "作成"}
        </Button>
      </div>
    </form>
  )
}
