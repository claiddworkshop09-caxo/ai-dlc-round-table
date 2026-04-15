"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectOption } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TaskCard, type Task } from "./TaskCard"
import { TaskForm, type TaskFormData } from "./TaskForm"

interface Project {
  id: string
  name: string
  description: string | null
  createdAt: Date
  updatedAt: Date
}

interface TasksClientProps {
  initialTasks: Task[]
  initialProjects: Project[]
}

// JSON レスポンスの日付文字列を Date に変換するヘルパー
function parseTask(raw: Record<string, unknown>): Task {
  return {
    ...(raw as Omit<Task, "createdAt" | "updatedAt">),
    createdAt: new Date(raw.createdAt as string),
    updatedAt: new Date(raw.updatedAt as string),
  } as Task
}

export function TasksClient({ initialTasks, initialProjects }: TasksClientProps) {
  // タスク・プロジェクト状態
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks)
  const [projects] = React.useState<Project[]>(initialProjects)

  // フィルター状態
  const [filterProjectId, setFilterProjectId] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState("")
  const [filterPriority, setFilterPriority] = React.useState("")

  // ダイアログ状態
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingTask, setEditingTask] = React.useState<Task | null>(null)

  // フィルター適用後のタスク一覧
  const filteredTasks = tasks.filter((task) => {
    if (filterProjectId && task.projectId !== filterProjectId) return false
    if (filterStatus && task.status !== filterStatus) return false
    if (filterPriority && task.priority !== filterPriority) return false
    return true
  })

  // ダイアログを開く（新規作成）
  const handleOpenCreate = () => {
    setEditingTask(null)
    setIsDialogOpen(true)
  }

  // ダイアログを開く（編集）
  const handleOpenEdit = (task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  // ダイアログを閉じる
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTask(null)
  }

  // タスク作成
  const handleCreateTask = async (data: TaskFormData) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        description: data.description || null,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate || null,
        projectId: data.projectId || null,
      }),
    })

    if (!response.ok) {
      throw new Error("タスクの作成に失敗しました")
    }

    const created = parseTask(await response.json())
    setTasks((prev) => [created, ...prev])
    handleCloseDialog()
  }

  // タスク更新
  const handleUpdateTask = async (data: TaskFormData) => {
    if (!editingTask) return

    const response = await fetch(`/api/tasks/${editingTask.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        description: data.description || null,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate || null,
        projectId: data.projectId || null,
      }),
    })

    if (!response.ok) {
      throw new Error("タスクの更新に失敗しました")
    }

    const updated = parseTask(await response.json())
    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    )
    handleCloseDialog()
  }

  // 完了トグル
  const handleToggleComplete = async (task: Task) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        completed: !task.completed,
        status: !task.completed ? "done" : "todo",
      }),
    })

    if (!response.ok) return

    const updated = parseTask(await response.json())
    setTasks((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    )
  }

  // タスク削除
  const handleDeleteTask = async (task: Task) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("タスクの削除に失敗しました")
    }

    setTasks((prev) => prev.filter((t) => t.id !== task.id))
  }

  // フォームの初期値（編集時）
  const editingFormData: Partial<TaskFormData> | undefined = editingTask
    ? {
        title: editingTask.title,
        description: editingTask.description ?? "",
        status: editingTask.status,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate ?? "",
        projectId: editingTask.projectId ?? "",
      }
    : undefined

  return (
    <div className="flex min-h-full flex-1 flex-col bg-muted/40">
      {/* ヘッダーエリア */}
      <div className="border-b bg-card px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-lg font-semibold">タスク一覧</h1>
            <Button onClick={handleOpenCreate}>
              <PlusIcon />
              タスクを追加
            </Button>
          </div>

          {/* フィルター */}
          <div className="mt-3 flex flex-wrap gap-2">
            {/* プロジェクトフィルター */}
            {projects.length > 0 && (
              <div className="w-40">
                <Select
                  value={filterProjectId}
                  onChange={(e) => setFilterProjectId(e.target.value)}
                  aria-label="プロジェクトで絞り込み"
                >
                  <SelectOption value="">全プロジェクト</SelectOption>
                  {projects.map((p) => (
                    <SelectOption key={p.id} value={p.id}>
                      {p.name}
                    </SelectOption>
                  ))}
                </Select>
              </div>
            )}

            {/* ステータスフィルター */}
            <div className="w-32">
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                aria-label="ステータスで絞り込み"
              >
                <SelectOption value="">全ステータス</SelectOption>
                <SelectOption value="todo">未着手</SelectOption>
                <SelectOption value="in_progress">進行中</SelectOption>
                <SelectOption value="done">完了</SelectOption>
              </Select>
            </div>

            {/* 優先度フィルター */}
            <div className="w-28">
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                aria-label="優先度で絞り込み"
              >
                <SelectOption value="">全優先度</SelectOption>
                <SelectOption value="high">高</SelectOption>
                <SelectOption value="medium">中</SelectOption>
                <SelectOption value="low">低</SelectOption>
              </Select>
            </div>

            {/* フィルタークリア */}
            {(filterProjectId || filterStatus || filterPriority) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilterProjectId("")
                  setFilterStatus("")
                  setFilterPriority("")
                }}
              >
                クリア
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* タスク一覧 */}
      <div className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-4xl">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">
                {tasks.length === 0
                  ? "タスクがありません。「タスクを追加」から作成してください。"
                  : "絞り込み条件に一致するタスクがありません。"}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projects={projects}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* タスク作成・編集ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onClose={handleCloseDialog}>
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "タスクを編集" : "タスクを作成"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            key={editingTask?.id ?? "new"}
            initialData={editingFormData}
            projects={projects}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={handleCloseDialog}
            isEdit={!!editingTask}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
