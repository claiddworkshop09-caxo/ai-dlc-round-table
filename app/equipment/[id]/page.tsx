import Link from "next/link"
import { notFound } from "next/navigation"
import { eq, desc, isNull } from "drizzle-orm"
import { ArrowLeftIcon, QrCodeIcon } from "lucide-react"
import { db } from "@/src/db"
import { equipment, equipmentLoans } from "@/src/schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QRCodeDisplay } from "./_components/QRCodeDisplay"

export const dynamic = "force-dynamic"

export default async function EquipmentDetailPage({
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

  const [loans, [activeLoan]] = await Promise.all([
    db
      .select()
      .from(equipmentLoans)
      .where(eq(equipmentLoans.equipmentId, id))
      .orderBy(desc(equipmentLoans.loanedAt)),
    db
      .select()
      .from(equipmentLoans)
      .where(eq(equipmentLoans.equipmentId, id))
      .where(isNull(equipmentLoans.returnedAt)),
  ])

  const loanUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/equipment/${id}/loan`

  return (
    <div className="flex min-h-full flex-1 flex-col bg-muted/40">
      <div className="border-b bg-card px-4 py-4">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/equipment" aria-label="備品一覧へ戻る">
              <ArrowLeftIcon />
            </Link>
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{item.name}</h1>
            {item.modelNumber && (
              <p className="text-xs text-muted-foreground">{item.modelNumber}</p>
            )}
          </div>
          <div className="ml-auto">
            {activeLoan ? (
              <Badge variant="destructive">貸出中: {activeLoan.borrowerName}</Badge>
            ) : (
              <Badge variant="success">返却済</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* 説明 */}
          {item.description && (
            <div className="rounded-lg bg-card p-4 border">
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          )}

          {/* QRコードセクション */}
          <div className="rounded-lg bg-card p-6 border space-y-4">
            <div className="flex items-center gap-2">
              <QrCodeIcon className="size-5" />
              <h2 className="font-semibold">QRコード</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              このQRコードをスキャンすると貸し出し・返却ページにアクセスできます。
            </p>
            <QRCodeDisplay value={loanUrl} />
            <p className="text-xs text-muted-foreground break-all">{loanUrl}</p>
            <Button asChild>
              <Link href={`/equipment/${id}/loan`}>貸し出し・返却操作</Link>
            </Button>
          </div>

          {/* 貸し出し履歴 */}
          <div className="rounded-lg bg-card border">
            <div className="px-4 py-3 border-b">
              <h2 className="font-semibold">貸し出し履歴</h2>
            </div>
            {loans.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">
                貸し出し履歴はありません
              </p>
            ) : (
              <ul className="divide-y">
                {loans.map((loan) => (
                  <li key={loan.id} className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-medium">{loan.borrowerName}</span>
                      <div className="text-right text-xs text-muted-foreground space-y-0.5">
                        <p>
                          貸出: {new Date(loan.loanedAt).toLocaleString("ja-JP")}
                        </p>
                        {loan.returnedAt ? (
                          <p>
                            返却: {new Date(loan.returnedAt).toLocaleString("ja-JP")}
                          </p>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            貸出中
                          </Badge>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
