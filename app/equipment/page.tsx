import { desc, isNull } from "drizzle-orm"
import { db } from "@/src/db"
import { equipment, equipmentLoans } from "@/src/schema"
import { EquipmentClient } from "./_components/EquipmentClient"

export const dynamic = "force-dynamic"

export default async function EquipmentPage() {
  const [equipmentList, activeLoans] = await Promise.all([
    db.select().from(equipment).orderBy(desc(equipment.createdAt)),
    db
      .select()
      .from(equipmentLoans)
      .where(isNull(equipmentLoans.returnedAt)),
  ])

  const equipmentWithStatus = equipmentList.map((e) => ({
    ...e,
    activeLoan: activeLoans.find((l) => l.equipmentId === e.id) ?? null,
  }))

  return <EquipmentClient initialEquipment={equipmentWithStatus} />
}
