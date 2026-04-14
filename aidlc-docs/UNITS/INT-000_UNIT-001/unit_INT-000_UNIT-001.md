# INT-000 UNIT-001: 備品貸出管理アプリ全体

## 目的

QR コードで備品の貸出・返却を管理する Web アプリケーションを構築する。
US-001〜US-005 のすべてのユーザーストーリーを 1 Unit として実装する。

## スコープ

### 対象ユーザーストーリー
- US-001: 備品を登録して QR コードを発行する
- US-002: QR コードをスキャンして備品を借りる（利用者ドロップダウン選択）
- US-003: QR コードをスキャンして備品を返却する
- US-004: 貸出中の備品一覧を確認する
- US-005: 利用者を事前登録・管理する

### 技術スタック
- Next.js 16.2.2 (App Router) + React 19
- Drizzle ORM + Neon (PostgreSQL serverless)
- shadcn/ui + Tailwind CSS v4

## 境界

- 本 Unit はフロントエンド・バックエンド（Server Actions）・DB スキーマをすべて含む
- 認証・認可は対象外（PoC のためオープンアクセス）
- メール通知等の外部連携は対象外

## 依存関係

- Neon PostgreSQL データベース（環境変数 DATABASE_URL または NETLIFY_DATABASE_URL）
- 環境変数 NEXT_PUBLIC_BASE_URL（QR コード生成用ベース URL）

## Bolt 構成

| Bolt | 内容 |
|------|------|
| bolt-001 | DB スキーマ + 備品一覧・登録画面（US-001 基本部分） |
| bolt-002 | 備品詳細 + QR コード + 貸出・返却（US-001 QR / US-002 / US-003）|
| bolt-003 | 貸出中一覧トップページ（US-004）+ 利用者管理画面（US-005） |
