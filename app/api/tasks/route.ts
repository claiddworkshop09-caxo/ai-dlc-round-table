import { NextRequest, NextResponse } from "next/server"
import { db } from "@/src/db"
import { tasks } from "@/src/schema"
import { desc, eq, and } from "drizzle-orm"

// GET: タスク一覧取得（クエリパラメータ: projectId?, status?, priority?）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")

    // フィルター条件の組み立て
    const conditions = []
    if (projectId) conditions.push(eq(tasks.projectId, projectId))
    if (status) conditions.push(eq(tasks.status, status))
    if (priority) conditions.push(eq(tasks.priority, priority))

    const list = await db
      .select()
      .from(tasks)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(tasks.createdAt))

    return NextResponse.json(list)
  } catch (error) {
    console.error("タスク一覧取得エラー:", error)
    return NextResponse.json(
      { error: "タスク一覧の取得に失敗しました" },
      { status: 500 }
    )
  }
}

// POST: タスク作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      completed,
      projectId,
    } = body

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json(
        { error: "タイトルは必須です" },
        { status: 400 }
      )
    }

    const [created] = await db
      .insert(tasks)
      .values({
        title: title.trim(),
        description: description?.trim() ?? null,
        status: status ?? "todo",
        priority: priority ?? "medium",
        dueDate: dueDate ?? null,
        completed: completed ?? false,
        projectId: projectId ?? null,
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("タスク作成エラー:", error)
    return NextResponse.json(
      { error: "タスクの作成に失敗しました" },
      { status: 500 }
    )
  }
}
