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
import { createUser, deleteUser } from "./actions";

export const dynamic = "force-dynamic";

async function getUsers() {
  const { db } = await import("@/src/db");
  const { appUsers } = await import("@/src/schema");
  return db.select().from(appUsers).orderBy(desc(appUsers.createdAt));
}

export default async function UsersPage() {
  const userList = await getUsers();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">利用者管理</h1>

      <div className="grid gap-8 md:grid-cols-2">
        {/* 利用者登録フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>利用者を登録</CardTitle>
            <CardDescription>新しい利用者を登録します</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">名前 *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="例: 山田 太郎"
                  required
                  autoComplete="off"
                />
              </div>
              <Button type="submit" className="w-full">
                登録する
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 利用者一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>登録済み利用者</CardTitle>
            <CardDescription>
              {userList.length} 人登録されています
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userList.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                まだ利用者が登録されていません。
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {userList.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        登録日:{" "}
                        {user.createdAt.toLocaleString("ja-JP", {
                          dateStyle: "short",
                        })}
                      </p>
                    </div>
                    <form
                      action={async () => {
                        "use server";
                        await deleteUser(user.id);
                      }}
                    >
                      <Button
                        type="submit"
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        削除
                      </Button>
                    </form>
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
