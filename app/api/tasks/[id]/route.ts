import { NextRequest, NextResponse } from "next/server"
import { db } from "@/src/db"
import { tasks } from "@/src/schema"
import { eq } from "drizzle-orm"

// GET: タスク詳細取得
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id))

    if (!task) {
      return NextResponse.json(
        { error: "タスクが見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("タスク詳細取得エラー:", error)
    return NextResponse.json(
      { error: "タスクの取得に失敗しました" },
      { status: 500 }
    )
  }
}

// PATCH: タスク更新（部分更新）
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // 更新可能なフィールドのみ抽出
    const updateData: Partial<typeof tasks.$inferInsert> = {}
    if (body.title !== undefined) updateData.title = body.title.trim()
    if (body.description !== undefined)
      updateData.description = body.description?.trim() ?? null
    if (body.status !== undefined) updateData.status = body.status
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ?? null
    if (body.completed !== undefined) updateData.completed = body.completed
    if (body.projectId !== undefined) updateData.projectId = body.projectId ?? null

    // 更新日時を現在時刻に設定
    updateData.updatedAt = new Date()

    const [updated] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning()

    if (!updated) {
      return NextResponse.json(
        { error: "タスクが見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("タスク更新エラー:", error)
    return NextResponse.json(
      { error: "タスクの更新に失敗しました" },
      { status: 500 }
    )
  }
}

// DELETE: タスク削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const [deleted] = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning()

    if (!deleted) {
      return NextResponse.json(
        { error: "タスクが見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "削除しました" })
  } catch (error) {
    console.error("タスク削除エラー:", error)
    return NextResponse.json(
      { error: "タスクの削除に失敗しました" },
      { status: 500 }
    )
  }
}
