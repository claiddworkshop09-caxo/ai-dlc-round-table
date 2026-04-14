# INT-000 Component Design

## DB スキーマ（Drizzle ORM / PostgreSQL）

```ts
// src/schema.ts

// 備品テーブル
items {
  id          serial PRIMARY KEY
  name        text NOT NULL
  description text
  quantity    integer DEFAULT 1 NOT NULL
  created_at  timestamptz DEFAULT now() NOT NULL
}

// 利用者テーブル
app_users {
  id         serial PRIMARY KEY
  name       text NOT NULL
  created_at timestamptz DEFAULT now() NOT NULL
}

// 貸出記録テーブル
loans {
  id          serial PRIMARY KEY
  item_id     integer NOT NULL REFERENCES items(id)
  user_id     integer NOT NULL REFERENCES app_users(id)
  borrowed_at timestamptz DEFAULT now() NOT NULL
  returned_at timestamptz  -- NULL = 貸出中
}
```

注意: `comments` テーブルは既存のサンプルデータとして残す（削除しない）

## API Routes / Server Actions

| Action | ファイル | 処理 |
|--------|---------|------|
| createItem | app/items/actions.ts | items INSERT |
| deleteItem | app/items/actions.ts | items DELETE (貸出中でない場合のみ) |
| borrowItem | app/items/[id]/actions.ts | loans INSERT |
| returnItem | app/items/[id]/actions.ts | loans UPDATE (returned_at = now()) |
| createUser | app/users/actions.ts | app_users INSERT |
| deleteUser | app/users/actions.ts | app_users DELETE |

## 主要コンポーネント一覧

### レイアウト
- `app/layout.tsx` — グローバルレイアウト（ヘッダーナビ付き）

### ページ
- `app/page.tsx` — トップ：貸出中一覧
- `app/items/page.tsx` — 備品一覧 + 登録フォーム
- `app/items/[id]/page.tsx` — 備品詳細 + QR コード + 貸出/返却
- `app/users/page.tsx` — 利用者一覧 + 登録フォーム

### コンポーネント（shadcn/ui ベース）
- `components/ui/` — shadcn/ui 既存（Button, Card, Input, Label, Separator）
- `components/ui/select.tsx` — shadcn/ui Select（追加インストール必要）
- `components/ui/dialog.tsx` — shadcn/ui Dialog（QR コード表示用、追加インストール必要）
- `components/item-form.tsx` — 備品登録フォーム
- `components/user-form.tsx` — 利用者登録フォーム
- `components/loan-form.tsx` — 貸出フォーム（ドロップダウン）
- `components/qr-display.tsx` — QR コード表示（qrcode.react 等）

## QR コード生成

- ライブラリ: `qrcode` (npm) を Server Side で使用、PNG として `<img>` タグで表示
- URL 形式: `https://{NEXT_PUBLIC_BASE_URL}/items/{id}`
- 環境変数 `NEXT_PUBLIC_BASE_URL` でベース URL を設定
