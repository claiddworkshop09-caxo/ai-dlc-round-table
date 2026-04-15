# INT-000 UNIT-002: 備品QR管理機能

## Purpose（目的）
備品の登録・QRコード生成・QRスキャンによる貸し出し/返却管理を実装する。
担当者が備品の所在と貸し出し状況をリアルタイムで把握できるようにする。

## 対象 User Stories
- US-005: 備品QR貸し出し/返却管理

## Boundaries（境界）

### このUnitが担う範囲
- `equipment`（備品）テーブルのDBスキーマ
- `equipment_loans`（貸し出し履歴）テーブルのDBスキーマ
- 備品CRUD API（Next.js Route Handlers）
- 貸し出し・返却操作API
- 備品一覧画面（`/equipment`）
- 備品詳細・QRコード表示画面（`/equipment/[id]`）
- QRコードスキャン/アクセス後の貸し出し/返却操作画面（`/equipment/[id]/loan`）

### このUnitが担わない範囲
- タスク・プロジェクト管理（-> UNIT-001）
- ユーザー認証
- 既存コメント機能への変更

## Dependencies（依存）
- Drizzle ORM + Neon PostgreSQL（既存インフラ）
- Next.js App Router（既存）
- shadcn/ui + Tailwind CSS（既存）
- QRコード生成ライブラリ（`react-qr-code` 等）
- UNIT-001とは独立（DB共有のみ）

## Bolts

| Bolt ID | タイトル | 状態 |
|---------|----------|------|
| bolt-001 | DBスキーマ + 備品CRUD API + 備品一覧画面 + QRコード生成 + 貸し出し/返却操作 | **完了** |

## 作成日
2026-04-15
