# Bolt: bolt-001

## 0. Bolt Purpose
- **Target Intent**: INT-000
- **Target Unit**: INT-000_UNIT-001（タスク・プロジェクト管理機能）
- **Target User Stories**: US-001（タスク管理CRUD + 完了チェック）、US-002（プロジェクト管理）、US-003（締め切り日・優先度）
- **Goal (Definition of Done)**:
  - `projects` / `tasks` テーブルがDBに作成される（Drizzle マイグレーション）
  - タスク・プロジェクトのCRUD APIが動作する（Route Handlers）
  - `/tasks` でタスク一覧・作成・編集・削除・完了チェックができる
  - プロジェクトによるフィルタリングができる
  - 既存のコメント画面（`/`）が引き続き正常動作する

---

## 1. Scope

### In Scope
- Drizzle スキーマ追加: `projects`, `tasks` テーブル
- DBマイグレーション実行
- API Route Handlers:
  - `GET/POST /api/tasks`
  - `GET/PATCH/DELETE /api/tasks/[id]`
  - `GET/POST /api/projects`
  - `DELETE /api/projects/[id]`
- UI:
  - `/tasks` タスク一覧ページ
  - タスクカード（shadcn/ui Card）
  - タスク作成・編集フォーム（shadcn/ui Dialog + Form）
  - プロジェクトフィルター（Select）
  - 優先度・ステータスフィルター（Select）
  - 完了チェックボックス
  - 削除ボタン
- ナビゲーションへの「タスク」リンク追加

### Out of Scope
- カンバンボード（`/tasks/board`）-> bolt-002
- 備品QR管理 -> UNIT-002
- ドラッグ&ドロップ
- ユーザー認証

---

## 2. Dependencies & Prerequisites

### Dependencies
- Drizzle ORM + Neon PostgreSQL（既存インフラ、環境変数 `DATABASE_URL` or `NETLIFY_DATABASE_URL` で接続）
- shadcn/ui（既存、Card / Dialog / Input / Select / Textarea / Button / Badge / Checkbox 等）
- Next.js App Router（既存）

### Prerequisites
- 開発環境でのDB接続確認（`.env.local` に `DATABASE_URL` が設定済み）
- `npm run db:generate` + `npm run db:migrate` が実行可能

### Constraints（Brownfield）
- 既存の `comments` テーブルに変更を加えない
- 既存の `db/schema.ts` へ追記のみ行う
- 既存のページ（`/`）のルーティングを変更しない

---

## 3. Design Diff

### 更新するDesign
- **Logical Design**: DBスキーマ（`projects`, `tasks`）、API定義（既に記載済み）
- **Component Design**: ディレクトリ構成、コンポーネント詳細（既に記載済み）
- **Domain Design**: 変更なし（既に定義済み）

### 変更するI/O・API・データモデル

#### 追加テーブル
```
projects: id, name, description, created_at, updated_at
tasks: id, title, description, status, priority, due_date, completed, project_id, created_at, updated_at
```

#### 追加API
```
GET    /api/tasks         -> Task[]（クエリ: projectId?, status?, priority?）
POST   /api/tasks         -> Task（body: {title, description?, status?, priority?, dueDate?, completed?, projectId?}）
GET    /api/tasks/[id]    -> Task
PATCH  /api/tasks/[id]    -> Task（body: 変更フィールドのみ）
DELETE /api/tasks/[id]    -> {success: true}

GET    /api/projects      -> Project[]
POST   /api/projects      -> Project（body: {name, description?}）
DELETE /api/projects/[id] -> {success: true}
```

---

## 4. Implementation & Tests

### 実装対象ファイル（新規・変更）

| ファイル | 種別 | 説明 |
|----------|------|------|
| `db/schema.ts` | 変更 | `projects`, `tasks` テーブル定義を追記 |
| `drizzle/migrations/` | 生成 | `db:generate` でマイグレーションファイル生成 |
| `app/api/tasks/route.ts` | 新規 | GET, POST |
| `app/api/tasks/[id]/route.ts` | 新規 | GET, PATCH, DELETE |
| `app/api/projects/route.ts` | 新規 | GET, POST |
| `app/api/projects/[id]/route.ts` | 新規 | DELETE |
| `app/tasks/page.tsx` | 新規 | タスク一覧ページ |
| `app/tasks/_components/TaskList.tsx` | 新規 | タスク一覧コンポーネント |
| `app/tasks/_components/TaskCard.tsx` | 新規 | タスクカード |
| `app/tasks/_components/TaskForm.tsx` | 新規 | 作成・編集フォーム |
| `app/tasks/_components/TaskFilter.tsx` | 新規 | フィルター・ソートUI |
| `components/nav.tsx` または既存ヘッダー | 変更 | 「タスク」リンク追加 |

### ユニットテスト観点
- PoCのためユニットテストは省略（動作確認を手動で行う）
- 動作確認チェックリスト:
  - [ ] タスクを作成してDBに保存されることを確認
  - [ ] タスク一覧に表示されることを確認
  - [ ] タスクを編集して変更が反映されることを確認
  - [ ] タスクを削除して一覧から消えることを確認
  - [ ] 完了チェックでステータスが変わることを確認
  - [ ] プロジェクトフィルターが動作することを確認
  - [ ] 既存の `/` コメント画面が正常動作することを確認

---

## 5. Deployment Units

### 影響するデプロイ単位
- Netlify（既存環境）: 自動デプロイ（`main` ブランチへのpushで実行）

### デプロイ手順
1. `npm run db:generate` でマイグレーションファイル生成
2. `npm run db:migrate` でNeon DBへスキーマ適用（ローカルまたはCI）
3. `git push` でNetlifyへ自動デプロイ
4. Netlify環境変数 `NETLIFY_DATABASE_URL` が設定済みであることを確認

### ロールバック
- DBロールバックは手動（Neonのマイグレーション履歴を確認）
- アプリのロールバック: Netlify UIから以前のデプロイに戻す

---

## 6. Approval Gate
- [ ] Scope は合意されている
- [ ] Design diff は適切
- [ ] テスト観点は適切
- [ ] デプロイ・ロールバックは適切

Approver:
Approval Date:

---

## Outcome
- 完了したこと: （実装後に記載）
- 完了できなかったこと: （実装後に記載）
- 変更した設計・想定: （実装後に記載）

## Open Issues
- 未解決事項: なし
- ブロッカー: なし
- 保留中の決定事項: なし

## Next Bolt
- **次にやること**: bolt-002（カンバンボード `/tasks/board`）
- **必要な入力**: bolt-001が完了していること（タスクAPIが動作すること）
- **リスク**: なし

## 作成日
2026-04-15
