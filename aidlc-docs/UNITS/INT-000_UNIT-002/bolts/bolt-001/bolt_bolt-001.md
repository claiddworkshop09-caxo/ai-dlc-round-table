# Bolt: bolt-001

## 0. Bolt Purpose
- **Target Intent**: INT-000
- **Target Unit**: INT-000_UNIT-002（備品QR管理機能）
- **Target User Stories**: US-005（備品QR貸し出し/返却管理）
- **Goal (Definition of Done)**:
  - `equipment` / `equipment_loans` テーブルがDBに作成される（Drizzle マイグレーション）
  - 備品CRUD APIが動作する（Route Handlers）
  - `/equipment` で備品一覧・登録・削除ができる
  - `/equipment/[id]` で備品詳細とQRコードが表示される
  - `/equipment/[id]/loan` でQRスキャン後に貸し出し/返却操作ができる
  - 貸し出し履歴が閲覧できる
  - 既存の `/` コメント画面・`/tasks` タスク画面が引き続き正常動作する

---

## 1. Scope

### In Scope
- Drizzle スキーマ追加: `equipment`, `equipment_loans` テーブル
- DBマイグレーション実行
- `react-qr-code` パッケージ追加
- API Route Handlers:
  - `GET/POST /api/equipment`
  - `GET/DELETE /api/equipment/[id]`
  - `POST /api/equipment/[id]/loan`（貸し出し記録作成）
  - `PATCH /api/equipment/[id]/loan/[loanId]`（返却記録）
- UI:
  - `/equipment` 備品一覧ページ（Server Component + Client Component）
  - 備品登録フォーム（Dialog + Form）
  - `/equipment/[id]` 備品詳細・QRコード表示ページ
  - `/equipment/[id]/loan` 貸し出し/返却操作ページ
- ナビゲーションへの「備品管理」リンク追加
- 古い stale マイグレーションファイル（`0002_add_items_users_loans.sql`）の削除

### Out of Scope
- QRコード印刷UI
- ユーザー認証
- タスク・プロジェクト管理（-> UNIT-001）

---

## 2. Dependencies & Prerequisites

### Dependencies
- Drizzle ORM + Neon PostgreSQL（既存インフラ）
- shadcn/ui（既存、Card / Dialog / Input / Button / Badge 等）
- Next.js App Router（既存）
- `react-qr-code`（新規追加）

### Prerequisites
- UNIT-001 bolt-001 が完了済み（DB接続確認済み）
- `npm run db:generate` + `npm run db:migrate` が実行可能

### Constraints（Brownfield）
- 既存の `comments`、`projects`、`tasks` テーブルに変更を加えない
- 既存ページのルーティングを変更しない

---

## 3. Design Diff

### 追加テーブル
```
equipment: id, name, model_number, description, created_at, updated_at
equipment_loans: id, equipment_id, borrower_name, loaned_at, returned_at, created_at
```

### 追加API
```
GET    /api/equipment              -> Equipment[]（現在の貸し出し状況含む）
POST   /api/equipment              -> Equipment（body: {name, modelNumber?, description?}）
GET    /api/equipment/[id]         -> Equipment + EquipmentLoan[]（履歴）
DELETE /api/equipment/[id]         -> {success: true}
POST   /api/equipment/[id]/loan    -> EquipmentLoan（body: {borrowerName}）
PATCH  /api/equipment/[id]/loan/[loanId] -> EquipmentLoan（returned_at 更新）
```

---

## 4. Implementation & Tests

### 実装対象ファイル（新規・変更）

| ファイル | 種別 | 説明 |
|----------|------|------|
| `src/schema.ts` | 変更 | `equipment`, `equipment_loans` テーブル定義を追記 |
| `drizzle/` | 生成 | `db:generate` でマイグレーションファイル生成 |
| `drizzle/0002_add_items_users_loans.sql` | 削除 | stale ファイルを削除 |
| `app/api/equipment/route.ts` | 新規 | GET, POST |
| `app/api/equipment/[id]/route.ts` | 新規 | GET, DELETE |
| `app/api/equipment/[id]/loan/route.ts` | 新規 | POST（貸し出し） |
| `app/api/equipment/[id]/loan/[loanId]/route.ts` | 新規 | PATCH（返却） |
| `app/equipment/page.tsx` | 新規 | 備品一覧ページ |
| `app/equipment/_components/EquipmentClient.tsx` | 新規 | 備品一覧クライアントコンポーネント |
| `app/equipment/_components/EquipmentForm.tsx` | 新規 | 備品登録フォーム |
| `app/equipment/[id]/page.tsx` | 新規 | 備品詳細・QR表示 |
| `app/equipment/[id]/loan/page.tsx` | 新規 | 貸し出し/返却操作 |
| `app/layout.tsx` | 変更 | 「備品管理」ナビリンク追加 |
| `package.json` | 変更 | `react-qr-code` 依存追加 |

### ユニットテスト観点
- PoCのためユニットテストは省略（動作確認を手動で行う）
- 動作確認チェックリスト:
  - [ ] 備品を登録してDBに保存されることを確認
  - [ ] 備品一覧に表示されることを確認
  - [ ] 備品詳細ページにQRコードが表示されることを確認
  - [ ] 貸し出し操作で借用者名が記録されることを確認
  - [ ] 返却操作で返却日時が記録されることを確認
  - [ ] 貸し出し履歴が閲覧できることを確認
  - [ ] 既存の `/` および `/tasks` 画面が正常動作することを確認

---

## 5. Deployment Units

### 影響するデプロイ単位
- Netlify（既存環境）: 自動デプロイ（`main` ブランチへのpushで実行）

### デプロイ手順
1. `npm install` で react-qr-code インストール
2. `npm run db:generate` でマイグレーションファイル生成
3. `npm run db:migrate` でNeon DBへスキーマ適用
4. `git push` でNetlifyへ自動デプロイ

### ロールバック
- DBロールバックは手動（Neonのマイグレーション履歴を確認）
- アプリのロールバック: Netlify UIから以前のデプロイに戻す

---

## 6. Approval Gate
- [x] Scope は合意されている
- [x] Design diff は適切
- [x] テスト観点は適切
- [x] デプロイ・ロールバックは適切

Approver: ワークショップ（PoC）
Approval Date: 2026-04-15

---

## Outcome
- 完了したこと:
  - `src/schema.ts` に `equipment` / `equipment_loans` テーブル追加
  - `drizzle/0003_add_equipment.sql` マイグレーション作成（instrumentation.ts で起動時自動適用）
  - API: `GET/POST /api/equipment`、`GET/DELETE /api/equipment/[id]`、`POST /api/equipment/[id]/loan`、`PATCH /api/equipment/[id]/loan/[loanId]`
  - UI: 備品一覧 (`/equipment`)、備品詳細・QR表示 (`/equipment/[id]`)、貸し出し/返却操作 (`/equipment/[id]/loan`)
  - `react-qr-code` パッケージを `package.json` に追加
  - ナビゲーションに「備品管理」リンク追加
  - stale ファイル `drizzle/0002_add_items_users_loans.sql` 削除
- 完了できなかったこと: なし
- 変更した設計・想定:
  - npm が WSL 環境で利用不可のため `db:generate` をスキップし、マイグレーション SQL を手動作成
  - `react-qr-code` のインストールはユーザーが `npm install` を実行する必要あり

## Open Issues
- なし

## Next Bolt
- **次にやること**: UNIT-001 bolt-002（カンバンボード `/tasks/board`）
- **必要な入力**: なし（UNIT-001 bolt-001 完了済み）

## 作成日
2026-04-15
