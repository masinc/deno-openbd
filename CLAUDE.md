# Deno OpenBD API Client Library - 開発

## プロジェクト概要

このプロジェクトは、Deno向けのOpenBD APIクライアントライブラリです。

OpenBD（Open BibliographyData）は、
書誌情報・書影を無料で提供するWebAPIサービスです。日本国内で流通する書籍の詳細なメタデータ（タイトル、著者、出版社、ISBNなど）を取得できます。

本ライブラリの特徴：

- **型安全**: Zod v4による厳密なスキーマ検証
- **シンプルなAPI**: 直感的で使いやすいインターフェース
- **Deno最適化**: Denoの機能を最大限活用

## 開発方針

### アーキテクチャ原則

- **型安全性最優先**: Zod v4によるランタイム検証とTypeScript型の完全な一致
- **テストファースト開発**: 実装前にテストケースを定義
- **モジュラー設計**: 各APIクライアントは独立して使用可能
- **エラー処理の一貫性**: 予測可能なエラーハンドリング

## 技術スタック

- ランタイム: Deno 2.0+ (TypeScript)
- バリデーション: Zod v4 (型検証)
- HTTPクライアント: Denoの組み込み`fetch`
- テストフレームワーク: Denoの組み込みテスト機能

## API仕様

OpenBD APIの詳細仕様については、 @docs/openbd-api-specification.md を参照してください。

## 開発とテスト

詳細については、 @docs/release.md を参照してください。

### テスト

```bash
# 基本テスト
deno task test
```

### 全チェック

```bash
# 型チェック、フォーマット、Lintチェック, テスト
deno task check
```

## 更新履歴

更新履歴は @CHANGELOG.md に記述/参照してください
