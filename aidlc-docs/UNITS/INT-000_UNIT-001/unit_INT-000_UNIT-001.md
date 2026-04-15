# INT-000 UNIT-001: タスク・プロジェクト管理機能

## Purpose（目的）
タスクのCRUD、プロジェクト管理、締め切り日・優先度の設定、カンバンボード表示を実装する。
チームメンバーがタスクを一元管理し、進捗を可視化できるようにする。

## 対象 User Stories
- US-001: タスク管理（CRUD + 完了チェック）
- US-002: プロジェクト管理
- US-003: 締め切り日・優先度の設定
- US-004: カンバンボード表示

## Boundaries（境界）

### このUnitが担う範囲
- `tasks` テーブル・`projects` テーブルのDBスキーマ
- タスクCRUD API（Next.js Route Handlers）
- プロジェクトCRUD API
- タスク一覧画面（`/tasks`）
- カンバンボード画面（`/tasks/board`）
- タスク作成・編集フォーム（モーダルまたはページ）

### このUnitが担わない範囲
- 備品QR管理（-> UNIT-002）
- ユーザー認証
- 既存コメント機能への変更

## Dependencies（依存）
- Drizzle ORM + Neon PostgreSQL（既存インフラ）
- Next.js App Router（既存）
- shadcn/ui + Tailwind CSS（既存）
- UNIT-002とは独立（DB共有のみ）

## Bolts

| Bolt ID | タイトル | 状態 |
|---------|----------|------|
| bolt-001 | DBスキーマ + 基本CRUD API + タスク一覧画面 | 計画中 |
| bolt-002 | カンバンボード画面（US-004） | 未着手 |

## 作成日
2026-04-15
