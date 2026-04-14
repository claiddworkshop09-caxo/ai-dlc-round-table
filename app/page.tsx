import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export const dynamic = "force-dynamic";

async function getActiveLoans() {
  const { db } = await import("@/src/db");
  const { loans, items, appUsers } = await import("@/src/schema");
  const { eq, isNull } = await import("drizzle-orm");

  return db
    .select({
      loanId: loans.id,
      itemName: items.name,
      userName: appUsers.name,
      borrowedAt: loans.borrowedAt,
    })
    .from(loans)
    .innerJoin(items, eq(loans.itemId, items.id))
    .innerJoin(appUsers, eq(loans.userId, appUsers.id))
    .where(isNull(loans.returnedAt))
    .orderBy(loans.borrowedAt);
}

export default async function Page() {
  const activeLoans = await getActiveLoans();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">備品管理アプリ</h1>
          <p className="text-muted-foreground mt-1">
            QR コードで備品の貸出・返却を管理できます
          </p>
        </div>
        <Link href="/items" className={buttonVariants()}>備品一覧を見る</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>貸出中の備品</CardTitle>
          <CardDescription>
            現在貸出中の備品一覧です
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeLoans.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              現在貸出中の備品はありません。
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {activeLoans.map((loan) => (
                <li
                  key={loan.loanId}
                  className="rounded-lg border border-border bg-muted/50 px-4 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{loan.itemName}</p>
                      <p className="text-sm text-muted-foreground">
                        借りた人: {loan.userName}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {loan.borrowedAt.toLocaleString("ja-JP", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
