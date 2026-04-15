"use client"

import * as React from "react"
import { PencilIcon, Trash2Icon, CalendarIcon } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// タスクの型
export interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  dueDate: string | null
  completed: boolean
  projectId: string | null
  createdAt: Date
  updatedAt: Date
}

interface Project {
  id: string
  name: string
}

interface TaskCardProps {
  task: Task
  projects: Project[]
  onToggleComplete: (task: Task) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (task: Task) => Promise<void>
}

// 優先度ラベル・バリアント
const PRIORITY_LABEL: Record<string, string> = {
  high: "高",
  medium: "中",
  low: "低",
}

// badgeVariantsの型はBadgePropsのvariantに合わせる
const PRIORITY_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
> = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
}

// ステータスラベル
const STATUS_LABEL: Record<string, string> = {
  todo: "未着手",
  in_progress: "進行中",
  done: "完了",
}

export function TaskCard({
  task,
  projects,
  onToggleComplete,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const [isToggling, setIsToggling] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const projectName = projects.find((p) => p.id === task.projectId)?.name

  const handleToggle = (_e: React.ChangeEvent<HTMLInputElement>) => {
    setIsToggling(true)
    onToggleComplete(task).finally(() => setIsToggling(false))
  }

  const handleDelete = async () => {
    if (!confirm(`「${task.title}」を削除しますか？`)) return
    setIsDeleting(true)
    try {
      await onDelete(task)
    } finally {
      setIsDeleting(false)
    }
  }

  // 期限切れ判定
  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate) < new Date(new Date().toDateString())

  return (
    <Card
      className={task.completed ? "opacity-60" : ""}
      data-testid="task-card"
    >
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          {/* 完了チェックボックス */}
          <div className="mt-0.5">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggle}
              disabled={isToggling}
              aria-label="完了にする"
              className="size-4 rounded border-input accent-primary cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle
              className={`text-sm leading-snug ${
                task.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </CardTitle>
            {projectName && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {projectName}
              </p>
            )}
          </div>

          {/* 操作ボタン */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEdit(task)}
              aria-label="編集"
            >
              <PencilIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDelete}
              disabled={isDeleting}
              aria-label="削除"
              className="text-destructive hover:text-destructive"
            >
              <Trash2Icon />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-2">
        {/* 説明 */}
        {task.description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {task.description}
          </p>
        )}

        {/* バッジ類 */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* 優先度 */}
          <Badge variant={PRIORITY_VARIANT[task.priority] ?? "outline"}>
            {PRIORITY_LABEL[task.priority] ?? task.priority}
          </Badge>

          {/* ステータス */}
          <Badge variant="outline">
            {STATUS_LABEL[task.status] ?? task.status}
          </Badge>

          {/* 締め切り日 */}
          {task.dueDate && (
            <span
              className={`flex items-center gap-0.5 text-xs ${
                isOverdue ? "text-destructive font-medium" : "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="size-3" />
              {task.dueDate}
              {isOverdue && " (期限切れ)"}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
