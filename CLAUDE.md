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
- エラーハンドリング: neverthrow (Result型パターン)
- HTTPクライアント: Denoの組み込み`fetch`
- テストフレームワーク: Denoの組み込みテスト機能 + @std/testing

詳細は @deno.jsonc を参照

## API仕様

OpenBD APIの詳細仕様については、 @docs/openbd-api-specification.md
を参照してください。

## コーディングガイドライン

### ライブラリ import 規約

```typescript
// Zod v4 (必須) - v3のimportは禁止
import { z } from "zod/v4"; // ✅ 正しい
// import { z } from "zod";  // ❌ v3なので禁止

// XML Parser
import { XMLParser } from "fast-xml-parser";

// Error handling
import type { Result } from "neverthrow";
import { err, ok } from "neverthrow";

// テスト
import { assertEquals } from "@std/assert";
import { stub } from "@std/testing/mock";
```

### コーディングスタイル

1. **関数設計**
   - 純粋関数を優先
   - 副作用は最小限に
   - 高階関数とパイプライン処理を活用
   - 部分適用とカリー化を適切に使用

2. **エラー処理**
   - Result型パターンの採用 (`Result<T, E>`)
   - 例外は境界でのみキャッチ
   - エラーは値として扱う

3. **テスト戦略**
   - 純粋関数の単体テスト優先（27テスト）
   - モック機能を活用したネットワーク分離テスト
   - 実API通信による統合テスト（7テスト）
   - 包括的な型安全性検証

## 開発とテスト

| ファイル         | 説明                             |
| ---------------- | -------------------------------- |
| @docs/testing.md | テストの実行方法と戦略           |
| @docs/release.md | リリース手順とバージョン管理方法 |

### 利用可能なタスク

```bash
# 単体テスト（ネットワーク不要、高速）
deno task test

# 統合テスト（実API通信）
deno task test:integration

# 全テスト実行
deno task test:all

# 型チェック + Lint + フォーマット + 単体テスト
deno task check

# 開発中のウォッチモード
deno task dev
```

詳細は @deno.jsonc を参照

## 更新履歴

更新履歴は @CHANGELOG.md に記述/参照
