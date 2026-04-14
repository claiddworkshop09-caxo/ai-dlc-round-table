import Link from "next/link";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createItem } from "./actions";

export const dynamic = "force-dynamic";

async function getItems() {
  const { db } = await import("@/src/db");
  const { items } = await import("@/src/schema");
  return db.select().from(items).orderBy(desc(items.createdAt));
}

export default async function ItemsPage() {
  const itemList = await getItems();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">備品一覧</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 備品登録フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>備品を登録</CardTitle>
            <CardDescription>新しい備品を登録します</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createItem} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">備品名 *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="例: プロジェクター"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">説明</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="例: 会議室A用"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">数量</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  defaultValue="1"
                  min="1"
                />
              </div>
              <Button type="submit" className="w-full">
                登録する
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 備品一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>登録済み備品</CardTitle>
            <CardDescription>
              {itemList.length} 件登録されています
            </CardDescription>
          </CardHeader>
          <CardContent>
            {itemList.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                まだ備品が登録されていません。
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {itemList.map((item) => (
                  <li key={item.id}>
                    <Link href={`/items/${item.id}`}>
                      <div className="rounded-lg border border-border bg-muted/50 px-4 py-3 hover:bg-muted transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground bg-background border rounded px-2 py-0.5">
                            数量: {item.quantity}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          登録日:{" "}
                          {item.createdAt.toLocaleString("ja-JP", {
                            dateStyle: "short",
                          })}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
