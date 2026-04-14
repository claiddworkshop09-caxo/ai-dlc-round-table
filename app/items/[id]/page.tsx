import { notFound } from "next/navigation";
import { and, eq, isNull, desc } from "drizzle-orm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { borrowItem, returnItem } from "./actions";

export const dynamic = "force-dynamic";

async function getItemDetail(id: number) {
  const { db } = await import("@/src/db");
  const { items, loans, appUsers } = await import("@/src/schema");

  const item = await db
    .select()
    .from(items)
    .where(eq(items.id, id))
    .then((rows) => rows[0] ?? null);

  if (!item) return null;

  const activeLoan = await db
    .select({
      loanId: loans.id,
      userName: appUsers.name,
      borrowedAt: loans.borrowedAt,
    })
    .from(loans)
    .innerJoin(appUsers, eq(loans.userId, appUsers.id))
    .where(and(eq(loans.itemId, id), isNull(loans.returnedAt)))
    .then((rows) => rows[0] ?? null);

  const userList = await db.select().from(appUsers).orderBy(appUsers.name);

  return { item, activeLoan, userList };
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  const data = await getItemDetail(id);
  if (!data) notFound();

  const { item, activeLoan, userList } = data;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (typeof window === "undefined" ? "http://localhost:3000" : window.location.origin);
  const itemUrl = `${baseUrl}/items/${item.id}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{item.name}</h1>

      {item.description && (
        <p className="text-muted-foreground mb-6">{item.description}</p>
      )}

      {/* 貸出状況 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {activeLoan ? "貸出中" : "貸出可能"}
          </CardTitle>
          {activeLoan && (
            <CardDescription>
              {activeLoan.userName} さんが{" "}
              {activeLoan.borrowedAt.toLocaleString("ja-JP", {
                dateStyle: "short",
                timeStyle: "short",
              })}{" "}
              から借りています
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {activeLoan ? (
            /* 返却フォーム */
            <form
              action={async () => {
                "use server";
                await returnItem(activeLoan.loanId);
              }}
            >
              <Button type="submit" variant="outline" className="w-full">
                返却する
              </Button>
            </form>
          ) : (
            /* 貸出フォーム */
            <form action={borrowItem} className="space-y-4">
              <input type="hidden" name="itemId" value={item.id} />
              <div className="space-y-2">
                <label
                  htmlFor="userId"
                  className="text-sm font-medium leading-none"
                >
                  借りる人を選択
                </label>
                {userList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    利用者が登録されていません。先に利用者を登録してください。
                  </p>
                ) : (
                  <select
                    id="userId"
                    name="userId"
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">-- 選択してください --</option>
                    {userList.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              {userList.length > 0 && (
                <Button type="submit" className="w-full">
                  貸し出す
                </Button>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* QR コード（bolt-002 で実装予定） */}
      <Card>
        <CardHeader>
          <CardTitle>QR コード</CardTitle>
          <CardDescription>
            スマホでこの QR コードを読み取ると、この備品のページに移動します
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-xs text-muted-foreground break-all">{itemUrl}</p>
          <p className="text-sm text-muted-foreground">
            ※ QR コード表示は次のバージョンで実装予定です
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
