import { NextRequest, NextResponse } from "next/server"
import { db } from "@/src/db"
import { projects, tasks } from "@/src/schema"
import { eq } from "drizzle-orm"

// DELETE: プロジェクト削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 関連タスクのprojectIdをnullに設定してから削除
    await db
      .update(tasks)
      .set({ projectId: null })
      .where(eq(tasks.projectId, id))

    const [deleted] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning()

    if (!deleted) {
      return NextResponse.json(
        { error: "プロジェクトが見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "削除しました" })
  } catch (error) {
    console.error("プロジェクト削除エラー:", error)
    return NextResponse.json(
      { error: "プロジェクトの削除に失敗しました" },
      { status: 500 }
    )
  }
}
