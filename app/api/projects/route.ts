import { NextRequest, NextResponse } from "next/server"
import { db } from "@/src/db"
import { projects } from "@/src/schema"
import { desc } from "drizzle-orm"

// GET: プロジェクト一覧取得
export async function GET() {
  try {
    const list = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.createdAt))
    return NextResponse.json(list)
  } catch (error) {
    console.error("プロジェクト一覧取得エラー:", error)
    return NextResponse.json(
      { error: "プロジェクト一覧の取得に失敗しました" },
      { status: 500 }
    )
  }
}

// POST: プロジェクト作成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "プロジェクト名は必須です" },
        { status: 400 }
      )
    }

    const [created] = await db
      .insert(projects)
      .values({
        name: name.trim(),
        description: description?.trim() ?? null,
      })
      .returning()

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("プロジェクト作成エラー:", error)
    return NextResponse.json(
      { error: "プロジェクトの作成に失敗しました" },
      { status: 500 }
    )
  }
}
