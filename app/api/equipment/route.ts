import { NextResponse } from "next/server";
import { desc, eq, isNull } from "drizzle-orm";
import { db } from "@/src/db";
import { equipment, equipmentLoans } from "@/src/schema";

export async function GET() {
  const rows = await db
    .select()
    .from(equipment)
    .orderBy(desc(equipment.createdAt));

  // 各備品の現在の貸し出し状況を取得
  const activeLoans = await db
    .select()
    .from(equipmentLoans)
    .where(isNull(equipmentLoans.returnedAt));

  const equipmentWithStatus = rows.map((e) => ({
    ...e,
    activeLoan: activeLoans.find((l) => l.equipmentId === e.id) ?? null,
  }));

  return NextResponse.json(equipmentWithStatus);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, modelNumber, description } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const [created] = await db
    .insert(equipment)
    .values({
      name,
      modelNumber: modelNumber ?? null,
      description: description ?? null,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
