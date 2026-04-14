"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/src/db";
import { items } from "@/src/schema";
import { eq } from "drizzle-orm";

export async function createItem(formData: FormData) {
  const name = formData.get("name");
  const description = formData.get("description");
  const quantityStr = formData.get("quantity");

  if (typeof name !== "string" || name.trim() === "") {
    return;
  }

  const quantity = quantityStr ? parseInt(String(quantityStr), 10) : 1;

  await db.insert(items).values({
    name: name.trim(),
    description:
      typeof description === "string" && description.trim() !== ""
        ? description.trim()
        : null,
    quantity: isNaN(quantity) || quantity < 1 ? 1 : quantity,
  });

  revalidatePath("/items");
  revalidatePath("/");
}

export async function deleteItem(id: number) {
  await db.delete(items).where(eq(items.id, id));
  revalidatePath("/items");
  revalidatePath("/");
}
