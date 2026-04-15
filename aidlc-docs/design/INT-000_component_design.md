# INT-000 Component Design

## コンポーネント構成

### ディレクトリ構成（追加分のみ）

```
app/
├── tasks/
│   ├── page.tsx                    # タスク一覧ページ（Server Component）
│   ├── board/
│   │   └── page.tsx                # カンバンボードページ（Server Component）
│   └── _components/
│       ├── TaskList.tsx            # タスク一覧コンポーネント（Client Component）
│       ├── TaskCard.tsx            # タスクカードコンポーネント（Client Component）
│       ├── TaskForm.tsx            # タスク作成/編集フォーム（Client Component）
│       ├── TaskFilter.tsx          # フィルター・ソートUI（Client Component）
│       └── KanbanBoard.tsx         # カンバンボード（Client Component）
├── equipment/
│   ├── page.tsx                    # 備品一覧ページ（Server Component）
│   ├── [id]/
│   │   ├── page.tsx                # 備品詳細・QR表示ページ（Server Component）
│   │   └── loan/
│   │       └── page.tsx            # 貸し出し/返却操作ページ（Client Component）
│   └── _components/
│       ├── EquipmentList.tsx       # 備品一覧コンポーネント（Client Component）
│       ├── EquipmentCard.tsx       # 備品カードコンポーネント
│       ├── EquipmentForm.tsx       # 備品登録フォーム（Client Component）
│       ├── QRCodeDisplay.tsx       # QRコード表示（Client Component）
│       ├── LoanForm.tsx            # 貸し出しフォーム（Client Component）
│       └── LoanHistory.tsx         # 貸し出し履歴（Server Component）
└── api/
    ├── tasks/
    │   ├── route.ts                # GET, POST /api/tasks
    │   └── [id]/
    │       └── route.ts            # GET, PATCH, DELETE /api/tasks/[id]
    ├── projects/
    │   ├── route.ts                # GET, POST /api/projects
    │   └── [id]/
    │       └── route.ts            # DELETE /api/projects/[id]
    └── equipment/
        ├── route.ts                # GET, POST /api/equipment
        └── [id]/
            ├── route.ts            # GET, DELETE /api/equipment/[id]
            └── loan/
                ├── route.ts        # POST /api/equipment/[id]/loan
                └── [loanId]/
                    └── route.ts    # PATCH /api/equipment/[id]/loan/[loanId]

db/
└── schema.ts                       # Drizzle スキーマ（projects, tasks, equipment, equipment_loans を追記）
```

---

## 主要コンポーネント詳細

### TaskList.tsx
- タスク一覧を表示するクライアントコンポーネント
- Props: `initialTasks: Task[]`, `projects: Project[]`
- 状態管理: フィルター選択状態、モーダル開閉状態
- API呼び出し: タスクCRUD（fetch）

### TaskCard.tsx
- 1タスクを表示するカードコンポーネント
- shadcn/ui の `Card` を使用
- 優先度に応じてバッジの色を変える（高=red、中=yellow、低=green）
- 編集ボタン・削除ボタン・完了チェックボックスを配置

### TaskForm.tsx
- タスク作成・編集フォーム
- shadcn/ui の `Dialog` + `Form` を使用
- フィールド: タイトル（Input）、説明（Textarea）、プロジェクト（Select）、優先度（Select）、ステータス（Select）、締め切り日（Input type=date）

### KanbanBoard.tsx
- To Do / In Progress / Done の3カラムレイアウト
- Tailwind CSS の grid/flex で実装
- 各タスクカードにステータス変更ボタン（「進める」「戻す」）を配置

### QRCodeDisplay.tsx
- `react-qr-code` を使用して備品URLのQRコードを表示
- 表示するURL: `{BASE_URL}/equipment/[id]/loan`
- 印刷用スタイル対応（任意）

### LoanForm.tsx
- 貸し出し: 借用者名入力フォーム + 貸し出しボタン
- 返却: 返却ボタン（現在の貸し出し情報を表示した上で確認）
- 操作後に完了メッセージを表示

---

## Drizzle スキーマ（db/schema.ts への追記）

```typescript
import { pgTable, uuid, text, boolean, timestamp, date } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const tasks = pgTable('tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('todo'),       // 'todo' | 'in_progress' | 'done'
  priority: text('priority').notNull().default('medium'), // 'high' | 'medium' | 'low'
  dueDate: date('due_date'),
  completed: boolean('completed').notNull().default(false),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const equipment = pgTable('equipment', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  modelNumber: text('model_number'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const equipmentLoans = pgTable('equipment_loans', {
  id: uuid('id').defaultRandom().primaryKey(),
  equipmentId: uuid('equipment_id').notNull().references(() => equipment.id, { onDelete: 'cascade' }),
  borrowerName: text('borrower_name').notNull(),
  loanedAt: timestamp('loaned_at').notNull().defaultNow(),
  returnedAt: timestamp('returned_at'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

---

## ナビゲーション設計

既存のヘッダー（またはサイドバー）にリンクを追加する。

```
ナビゲーション
  ├── コメント (/)           ← 既存
  ├── タスク (/tasks)        ← NEW
  └── 備品管理 (/equipment)  ← NEW
```

## 作成日
2026-04-15
