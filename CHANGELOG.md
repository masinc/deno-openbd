# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## バージョニング形式

- **0.MINOR.PATCH**: 現在は0.x.x形式を使用（MAJORバージョンは使用しない）
- **PATCH番号**: パッチリリースでは現在の日時分を使用 (YYYYMMDDHHMM)
  - 例: `0.1.202506141530` = 2025年6月14日15時30分のリリース
- **MINOR番号**: 新機能追加時に手動でインクリメント
- **MAJOR番号**: 現在のプロジェクトフェーズでは使用しない

## [0.2.202506151357] - 2025-06-15

### Added

- 包括的なテスト実装 (Issue #5)
  - 単体テスト 27個 - 低レベルAPI、高レベルAPI、型定義テスト
  - 統合テスト 7個 - 実際のOpenBD APIとの通信テスト
  - テストタスクの分離 (`deno task test`, `deno task test:integration`,
    `deno task test:all`)
  - @std/testing依存関係追加によるモック機能活用
- テストドキュメント (`docs/testing.md`)
  - テスト戦略、実行方法、トラブルシューティング
  - 34個全テストの詳細説明
- 開発指針の更新 (`CLAUDE.md`)
  - テスト情報の統合、技術スタック更新

### Changed

- テスト実行環境の整備
  - 単体テストと統合テストの適切な分離
  - CI効率化のためのテスト戦略確立
  - 高速な開発フィードバックループの実現

### Fixed

- リントエラーの修正
  - 不要な`async`キーワードの削除
  - 未使用型インポートの整理
- フォーマット問題の解決
- モック関数の適切な型注釈

## [0.1.202506151306] - 2025-06-15

### Added

- 基本的なAPIクライアント実装（ISBN検索機能）
- 低レベルAPI: 型安全なOpenBD API呼び出し機能
- 高レベルAPI: ユーザー向けの便利なgetBook関数
- 単一ISBNおよび複数ISBN検索のサポート
- neverthrowのResult型による包括的エラーハンドリング
- 全ユースケースの動作例（examples/）
  - 単一書籍検索 (get_single_book.ts)
  - 複数書籍検索 (get_multiple_books.ts)
  - カバレッジ情報取得 (get_coverage.ts)
  - エラーハンドリングパターン (error_handling.ts)
- インポート検証テスト
- Zodスキーマの明示的型注釈（Lint要件対応）
- mod.tsでの高レベルAPIのみの公開

### Changed

- Zod v4スキーマ定義の完全な型安全化
- neverthrow依存関係の追加
