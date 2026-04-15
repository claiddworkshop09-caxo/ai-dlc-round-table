import { notFound } from "next/navigation"
import { and, eq, isNull } from "drizzle-orm"
import { db } from "@/src/db"
import { equipment, equipmentLoans } from "@/src/schema"
import { LoanClient } from "./_components/LoanClient"

export const dynamic = "force-dynamic"

export default async function LoanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [item] = await db
    .select()
    .from(equipment)
    .where(eq(equipment.id, id))

  if (!item) notFound()

  const [activeLoan] = await db
    .select()
    .from(equipmentLoans)
    .where(and(eq(equipmentLoans.equipmentId, id), isNull(equipmentLoans.returnedAt)))

  return (
    <LoanClient
      equipment={item}
      activeLoan={activeLoan ?? null}
    />
  )
}
