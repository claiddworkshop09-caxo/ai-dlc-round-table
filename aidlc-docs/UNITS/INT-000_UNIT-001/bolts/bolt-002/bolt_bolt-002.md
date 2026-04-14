# Bolt: bolt-002

## 0. Bolt Purpose
- Target Intent: INT-000
- Target Unit: INT-000_UNIT-001
- Target User Stories: US-001（QR コード発行）、US-002 / US-003（貸出・返却完成）
- Goal (Definition of Done):
  - 備品詳細ページに QR コード画像が表示される
  - QR コードをスキャンすると `/items/[id]` に遷移できる
  - 備品ごとの貸出履歴が閲覧できる

## 1. Scope
### In Scope
- `app/items/[id]/page.tsx` への QR コード表示追加
- QR コード生成ライブラリの追加（`qrcode` パッケージ）
- 貸出履歴セクションの追加（備品詳細ページ内）
- `package.json` への `qrcode` 依存追加

### Out of Scope
- QR コードの印刷 UI（詳細は後の Bolt）
- 利用者管理の追加機能

## 2. Dependencies & Prerequisites
- Dependencies: bolt-001 が完了済みであること
- Prerequisites:
  - `NEXT_PUBLIC_BASE_URL` 環境変数が設定されていること
  - `npm install qrcode @types/qrcode` が実行されること
- Constraints: Server Component で QR コードを PNG として生成する

## 3. Design Diff
- Component Design の「QR コード生成」セクションを実装に反映
- `qrcode` パッケージを Server Component で使用し、Data URL として `<img>` に渡す

## 4. Implementation & Tests
- Target paths:
  - `package.json`（qrcode 追加）
  - `app/items/[id]/page.tsx`（QR コード + 貸出履歴追加）

## 5. Deployment Units
- `npm install` で qrcode パッケージが追加される
- 環境変数 `NEXT_PUBLIC_BASE_URL` をデプロイ環境に設定

## 6. Approval Gate
- [ ] Scope is agreed upon
- [ ] Design diff is appropriate
- [ ] Test viewpoints are appropriate
- [ ] Deployment/rollback is appropriate

Approver:
Approval Date:

## Outcome
（実装完了後に記入）

## Open Issues
- `NEXT_PUBLIC_BASE_URL` の設定方法を確認

## Next Bolt
- bolt-003: 貸出中一覧のフィルタリング強化 + QR コード印刷 UI（必要であれば）
