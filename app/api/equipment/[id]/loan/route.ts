import { NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/src/db";
import { equipment, equipmentLoans } from "@/src/schema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { borrowerName } = body;

  if (!borrowerName || typeof borrowerName !== "string") {
    return NextResponse.json(
      { error: "borrowerName is required" },
      { status: 400 }
    );
  }

  // 備品の存在確認
  const [item] = await db
    .select()
    .from(equipment)
    .where(eq(equipment.id, id));

  if (!item) {
    return NextResponse.json({ error: "Equipment not found" }, { status: 404 });
  }

  // 既に貸し出し中かチェック
  const [activeLoan] = await db
    .select()
    .from(equipmentLoans)
    .where(and(eq(equipmentLoans.equipmentId, id), isNull(equipmentLoans.returnedAt)));

  if (activeLoan) {
    return NextResponse.json(
      { error: "Equipment is already on loan" },
      { status: 409 }
    );
  }

  const [loan] = await db
    .insert(equipmentLoans)
    .values({ equipmentId: id, borrowerName })
    .returning();

  return NextResponse.json(loan, { status: 201 });
}
