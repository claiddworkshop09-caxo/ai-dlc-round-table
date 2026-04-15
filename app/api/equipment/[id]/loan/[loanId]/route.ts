import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/src/db";
import { equipmentLoans } from "@/src/schema";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string; loanId: string }> }
) {
  const { loanId } = await params;

  const [loan] = await db
    .select()
    .from(equipmentLoans)
    .where(eq(equipmentLoans.id, loanId));

  if (!loan) {
    return NextResponse.json({ error: "Loan not found" }, { status: 404 });
  }

  if (loan.returnedAt) {
    return NextResponse.json(
      { error: "Already returned" },
      { status: 409 }
    );
  }

  const [updated] = await db
    .update(equipmentLoans)
    .set({ returnedAt: new Date() })
    .where(eq(equipmentLoans.id, loanId))
    .returning();

  return NextResponse.json(updated);
}
