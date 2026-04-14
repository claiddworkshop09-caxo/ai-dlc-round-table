# INT-000 Logical Design

## アーキテクチャ

Next.js App Router + Server Actions 構成。
DB は Neon (PostgreSQL serverless) + Drizzle ORM。

```
Browser (スマホ/PC)
    |
    | HTTP
    v
Next.js App Router (Netlify / Vercel)
    ├── Server Components (データ取得・表示)
    ├── Server Actions (データ更新)
    └── Drizzle ORM
            |
            v
        Neon PostgreSQL
```

## ページ構成

| パス | 機能 | 主な Server Action |
|------|------|-------------------|
| `/` | トップページ：貸出中備品一覧 + 備品一覧へのリンク | - |
| `/items` | 備品一覧 + 備品登録フォーム | createItem |
| `/items/[id]` | 備品詳細 + QR コード + 貸出/返却ボタン | borrowItem, returnItem |
| `/users` | 利用者一覧 + 利用者登録フォーム | createUser, deleteUser |

## データフロー

### 備品登録
1. `/items` で管理者がフォームに名称・説明・数量を入力
2. Server Action `createItem` が `items` テーブルに INSERT
3. 登録完了後、備品一覧を revalidate して表示更新

### 貸出
1. 利用者がスマホで QR コードをスキャン → `/items/[id]` へ遷移
2. ページにドロップダウン（登録済み利用者一覧）と「貸出」ボタンを表示
3. 利用者を選択して送信 → Server Action `borrowItem` が `loans` テーブルに INSERT

### 返却
1. `/items/[id]` に現在の貸出情報（借りた人・日時）を表示
2. 「返却」ボタン押下 → Server Action `returnItem` が `loans.returnedAt` を UPDATE

### 利用者管理
1. `/users` で管理者が名前を入力して登録
2. Server Action `createUser` が `app_users` テーブルに INSERT
3. 削除ボタン押下 → Server Action `deleteUser` が DELETE

## ナビゲーション

- ヘッダーにグローバルナビ（トップ / 備品管理 / 利用者管理）を配置
- モバイルでも使いやすいレイアウト（shadcn/ui + Tailwind）
