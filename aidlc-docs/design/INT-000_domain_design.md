# INT-000 Domain Design

## ドメイン概要
タスク・プロジェクト管理と備品QR管理の2つのサブドメインで構成される。

---

## サブドメイン 1: タスク・プロジェクト管理

### 用語定義

| 用語 | 定義 |
|------|------|
| タスク (Task) | チームが実施すべき作業の最小単位。タイトル・説明・優先度・締め切り日・ステータスを持つ |
| プロジェクト (Project) | 複数のタスクをグループ化する単位。名前・説明を持つ |
| ステータス (Status) | タスクの進行状態。「To Do」「In Progress」「Done」の3値 |
| 優先度 (Priority) | タスクの重要度。「高(high)」「中(medium)」「低(low)」の3値 |
| 締め切り日 (Due Date) | タスクを完了すべき期限日 |
| 完了チェック (Completed) | タスクが完了したかどうかを示すフラグ |

### 主要エンティティ

```
Project（プロジェクト）
  - id: UUID (PK)
  - name: string (必須)
  - description: string (任意)
  - created_at: datetime
  - updated_at: datetime

Task（タスク）
  - id: UUID (PK)
  - title: string (必須)
  - description: string (任意)
  - status: enum('todo', 'in_progress', 'done')
  - priority: enum('high', 'medium', 'low')
  - due_date: date (任意)
  - completed: boolean
  - project_id: UUID (FK -> Project, 任意)
  - created_at: datetime
  - updated_at: datetime
```

### エンティティ関係
```
Project 1 --- 0..* Task
（1つのプロジェクトに複数のタスクが属する。タスクはプロジェクトなしでも存在可能）
```

---

## サブドメイン 2: 備品QR管理

### 用語定義

| 用語 | 定義 |
|------|------|
| 備品 (Equipment) | 管理対象のPC・機材等の物品。名前・型番を持つ |
| 貸し出し記録 (EquipmentLoan) | 備品の貸し出し・返却の履歴。借用者名・貸し出し日時・返却日時を持つ |
| 貸出中 (On Loan) | 備品が現在貸し出されている状態（返却日時がnull） |
| 返却済 (Returned) | 備品が返却された状態（返却日時が記録されている） |
| QRコード | 備品IDを埋め込んだQRコード。スキャンで貸し出し/返却画面にアクセスする |
| 借用者 (Borrower) | 備品を借りた人の名前（認証なしのため自己申告） |

### 主要エンティティ

```
Equipment（備品）
  - id: UUID (PK)
  - name: string (必須)
  - model_number: string (任意)
  - description: string (任意)
  - created_at: datetime
  - updated_at: datetime

EquipmentLoan（貸し出し記録）
  - id: UUID (PK)
  - equipment_id: UUID (FK -> Equipment)
  - borrower_name: string (必須)
  - loaned_at: datetime (貸し出し日時)
  - returned_at: datetime (返却日時、null=貸出中)
  - created_at: datetime
```

### エンティティ関係
```
Equipment 1 --- 0..* EquipmentLoan
（1つの備品に複数の貸し出し履歴が存在する。同時貸し出しは1件のみ）
```

---

## ドメイン境界まとめ

```
[既存: コメントドメイン]      [タスク・プロジェクトドメイン]      [備品QRドメイン]
  Comment                    Project <-- Task                   Equipment <-- EquipmentLoan
  (変更なし)                                                     (QRコードでアクセス)
```

## 作成日
2026-04-15
