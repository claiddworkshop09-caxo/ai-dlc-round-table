import { desc } from "drizzle-orm"
import { db } from "@/src/db"
import { projects, tasks } from "@/src/schema"
import { TasksClient } from "./_components/TasksClient"

// 常に最新データを取得
export const dynamic = "force-dynamic"

export default async function TasksPage() {
  // 並列でデータ取得
  const [projectList, taskList] = await Promise.all([
    db.select().from(projects).orderBy(desc(projects.createdAt)),
    db.select().from(tasks).orderBy(desc(tasks.createdAt)),
  ])

  return (
    <TasksClient
      initialTasks={taskList}
      initialProjects={projectList}
    />
  )
}
