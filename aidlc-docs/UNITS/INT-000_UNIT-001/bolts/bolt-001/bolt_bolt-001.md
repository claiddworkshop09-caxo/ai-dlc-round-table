# Bolt: bolt-001

## 0. Bolt Purpose
- Target Intent: INT-000
- Target Unit: INT-000_UNIT-001
- Target User Stories: US-001（備品登録・一覧の基盤）、US-005（利用者管理）の基本部分
- Goal (Definition of Done):
  - DB スキーマ（items / app_users / loans テーブル）が定義・マイグレーション済み
  - 備品一覧ページ（`/items`）で備品の一覧表示と新規登録ができる
  - トップページ（`/`）が貸出中一覧を表示するランディングページになっている
  - グローバルナビゲーションが layout.tsx に組み込まれている
  - 利用者管理ページ（`/users`）で利用者の一覧・登録・削除ができる
  - 備品詳細ページ（`/items/[id]`）で貸出・返却の基本フローが動作する

## 1. Scope
### In Scope
- `src/schema.ts` の更新（items / app_users / loans テーブル追加）
- `drizzle/0002_add_items_users_loans.sql` マイグレーション追加
- `app/layout.tsx` のヘッダーナビ追加
- `app/page.tsx` のトップページ（貸出中一覧）
- `app/items/page.tsx` の備品一覧 + 登録フォーム
- `app/items/actions.ts` の Server Actions（createItem, deleteItem）
- `app/items/[id]/page.tsx` の備品詳細（貸出フォーム・返却ボタン含む）
- `app/items/[id]/actions.ts` の Server Actions（borrowItem, returnItem）
- `app/users/page.tsx` の利用者一覧 + 登録フォーム
- `app/users/actions.ts` の Server Actions（createUser, deleteUser）

### Out of Scope
- QR コード画像の表示（bolt-002）
- 貸出履歴ページ（bolt-002 以降）

## 2. Dependencies & Prerequisites
- Dependencies: Neon PostgreSQL（DATABASE_URL 環境変数）
- Prerequisites: 既存 `comments` テーブルは残す（スキーマに定義済み）
- Constraints: 既存の `src/schema.ts` / `src/db.ts` の構造を踏襲

## 3. Design Diff
- Component Design の DB スキーマ定義を実装に反映
- `src/schema.ts` に items / app_users / loans を追加
- Logical Design のページ構成に従い `/items`, `/users`, `/items/[id]` を新設

## 4. Implementation & Tests
- Target paths:
  - `src/schema.ts`
  - `drizzle/0002_add_items_users_loans.sql`
  - `drizzle/meta/0002_snapshot.json`
  - `app/layout.tsx`
  - `app/page.tsx`
  - `app/items/page.tsx`
  - `app/items/actions.ts`
  - `app/items/[id]/page.tsx`
  - `app/items/[id]/actions.ts`
  - `app/users/page.tsx`
  - `app/users/actions.ts`

## 5. Deployment Units
- Netlify / Vercel にデプロイ
- `npm run db:generate && npm run db:migrate` でマイグレーション実行（`postinstall` で自動実行される）

## 6. Approval Gate
- [x] Scope is agreed upon
- [x] Design diff is appropriate
- [x] Test viewpoints are appropriate
- [x] Deployment/rollback is appropriate

Approver: ワークショップ参加者
Approval Date: 2026-04-15

## Outcome

### 完了したこと
- DB スキーマ: `items`, `app_users`, `loans` テーブルを `src/schema.ts` に追加
- マイグレーション: `drizzle/0002_add_items_users_loans.sql` を手動作成
- グローバルナビゲーション: `app/layout.tsx` にヘッダーナビ（トップ / 備品一覧 / 利用者管理）を追加
- トップページ (`/`): 貸出中の備品一覧を表示（US-004 先行実装）
- 備品一覧ページ (`/items`): 備品の登録フォーム + 一覧表示
- 備品詳細ページ (`/items/[id]`): 利用者ドロップダウンでの貸出フォーム + 返却ボタン
- 利用者管理ページ (`/users`): 利用者の登録フォーム + 一覧 + 削除

### 完了しなかったこと
- QR コード画像の表示（bolt-002 で実装）

### 変更した設計・前提
- bolt-001 のスコープを拡大し、備品詳細ページと利用者管理まで含めた（US-002 / US-003 / US-005 の基本部分）
- bolt-002 は QR コード機能と貸出履歴に絞る

## Open Issues
- node_modules が存在しないため、ローカルでのマイグレーション実行はデプロイ時の `postinstall` に依存する

## Next Bolt
- bolt-002: QR コード生成・表示（`qrcode` ライブラリ等）+ 貸出履歴ページ
- 必要な入力: `NEXT_PUBLIC_BASE_URL` 環境変数の設定
- リスク: QR コードライブラリの追加インストールが必要
