"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/src/db";
import { loans } from "@/src/schema";
import { eq, isNull } from "drizzle-orm";

export async function borrowItem(formData: FormData) {
  const itemIdStr = formData.get("itemId");
  const userIdStr = formData.get("userId");

  const itemId = parseInt(String(itemIdStr), 10);
  const userId = parseInt(String(userIdStr), 10);

  if (isNaN(itemId) || isNaN(userId)) return;

  await db.insert(loans).values({ itemId, userId });

  revalidatePath(`/items/${itemId}`);
  revalidatePath("/");
}

export async function returnItem(loanId: number) {
  const loanRow = await db
    .select()
    .from(loans)
    .where(eq(loans.id, loanId))
    .then((rows) => rows[0] ?? null);

  if (!loanRow) return;

  await db
    .update(loans)
    .set({ returnedAt: new Date() })
    .where(eq(loans.id, loanId));

  revalidatePath(`/items/${loanRow.itemId}`);
  revalidatePath("/");
}
