# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## バージョニング形式

- **0.MINOR.PATCH**: 現在は0.x.x形式を使用（MAJORバージョンは使用しない）
- **PATCH番号**: パッチリリースでは現在の日時分を使用 (YYYYMMDDHHMM)
  - 例: `0.1.202506141530` = 2025年6月14日15時30分のリリース
- **MINOR番号**: 新機能追加時に手動でインクリメント
- **MAJOR番号**: 現在のプロジェクトフェーズでは使用しない

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
