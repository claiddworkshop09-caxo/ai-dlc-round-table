# INT-000 Logical Design

## アーキテクチャ概要

Next.js App Router をベースとしたフルスタックアーキテクチャ。
既存のコメントアプリと同一リポジトリ・同一DBを共有する。

```
[ブラウザ]
    |
    v
[Next.js App Router]
  ├── app/                      (既存: コメント画面)
  ├── app/tasks/                (NEW: タスク一覧)
  ├── app/tasks/board/          (NEW: カンバンボード)
  ├── app/equipment/            (NEW: 備品一覧)
  └── app/equipment/[id]/       (NEW: 備品詳細・QR表示)
       └── loan/                (NEW: 貸し出し/返却操作)
    |
    v
[Route Handlers (API)]
  ├── app/api/tasks/            (NEW: タスクCRUD)
  ├── app/api/projects/         (NEW: プロジェクトCRUD)
  ├── app/api/equipment/        (NEW: 備品CRUD)
  └── app/api/equipment/[id]/loan/ (NEW: 貸し出し/返却)
    |
    v
[Drizzle ORM]
    |
    v
[Neon PostgreSQL]
  ├── comments (既存、変更なし)
  ├── projects (NEW)
  ├── tasks    (NEW)
  ├── equipment (NEW)
  └── equipment_loans (NEW)
```

---

## 画面遷移

```
/ (コメント画面・既存)
/tasks
  └── /tasks/board (カンバンボード)
/equipment
  └── /equipment/[id] (備品詳細・QR表示)
       └── /equipment/[id]/loan (貸し出し/返却操作)
```

---

## データフロー

### タスク作成フロー
```
ユーザー → タスク作成フォーム → POST /api/tasks → Drizzle → DB保存 → レスポンス → 一覧更新
```

### カンバンボード ステータス変更フロー
```
ユーザー → ステータスボタンクリック → PATCH /api/tasks/[id] → Drizzle → DB更新 → カンバン再描画
```

### 備品QR貸し出しフロー
```
QRコードスキャン → /equipment/[id]/loan → 借用者名入力 → POST /api/equipment/[id]/loan → DB保存 → 完了表示
```

### 備品返却フロー
```
QRコードスキャン → /equipment/[id]/loan → 返却ボタン → PATCH /api/equipment/[id]/loan/[loanId] → DB更新 → 完了表示
```

---

## DBスキーマ設計

```sql
-- プロジェクト
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- タスク
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  due_date DATE,
  completed BOOLEAN NOT NULL DEFAULT false,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 備品
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  model_number TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 貸し出し記録
CREATE TABLE equipment_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  borrower_name TEXT NOT NULL,
  loaned_at TIMESTAMP NOT NULL DEFAULT NOW(),
  returned_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## API設計

### タスクAPI

| Method | Path | 説明 |
|--------|------|------|
| GET | /api/tasks | タスク一覧取得（クエリ: projectId, status, priority） |
| POST | /api/tasks | タスク作成 |
| GET | /api/tasks/[id] | タスク詳細取得 |
| PATCH | /api/tasks/[id] | タスク更新 |
| DELETE | /api/tasks/[id] | タスク削除 |

### プロジェクトAPI

| Method | Path | 説明 |
|--------|------|------|
| GET | /api/projects | プロジェクト一覧取得 |
| POST | /api/projects | プロジェクト作成 |
| DELETE | /api/projects/[id] | プロジェクト削除 |

### 備品API

| Method | Path | 説明 |
|--------|------|------|
| GET | /api/equipment | 備品一覧取得（現在の貸し出し状況を含む） |
| POST | /api/equipment | 備品登録 |
| GET | /api/equipment/[id] | 備品詳細取得（貸し出し履歴含む） |
| DELETE | /api/equipment/[id] | 備品削除 |
| POST | /api/equipment/[id]/loan | 貸し出し記録作成 |
| PATCH | /api/equipment/[id]/loan/[loanId] | 返却記録（returned_at 更新） |

---

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Next.js 14 App Router (React Server Components + Client Components) |
| UIライブラリ | shadcn/ui + Tailwind CSS |
| QRコード生成 | react-qr-code |
| APIレイヤー | Next.js Route Handlers |
| ORM | Drizzle ORM |
| DB | Neon PostgreSQL |
| デプロイ | Netlify（既存環境） |

## 作成日
2026-04-15
