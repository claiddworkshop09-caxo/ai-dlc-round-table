import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/src/db";
import { equipment, equipmentLoans } from "@/src/schema";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [item] = await db
    .select()
    .from(equipment)
    .where(eq(equipment.id, id));

  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const loans = await db
    .select()
    .from(equipmentLoans)
    .where(eq(equipmentLoans.equipmentId, id))
    .orderBy(desc(equipmentLoans.loanedAt));

  return NextResponse.json({ ...item, loans });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db.delete(equipment).where(eq(equipment.id, id));

  return NextResponse.json({ success: true });
}
