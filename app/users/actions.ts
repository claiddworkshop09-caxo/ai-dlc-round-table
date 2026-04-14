"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/src/db";
import { appUsers } from "@/src/schema";
import { eq } from "drizzle-orm";

export async function createUser(formData: FormData) {
  const name = formData.get("name");

  if (typeof name !== "string" || name.trim() === "") {
    return;
  }

  await db.insert(appUsers).values({ name: name.trim() });
  revalidatePath("/users");
}

export async function deleteUser(id: number) {
  await db.delete(appUsers).where(eq(appUsers.id, id));
  revalidatePath("/users");
}
