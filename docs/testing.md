# テスト仕様

このドキュメントでは、deno-openbdプロジェクトのテスト戦略とテストの実行方法について説明します。

## テスト構成

### 単体テスト (Unit Tests)

実装された機能のユニットテストは `src/` ディレクトリ内に配置されています。

```
src/
├── client/
│   ├── low-level_test.ts      # 低レベルAPIのテスト
│   └── high-level_test.ts     # 高レベルAPIのテスト
└── types_test.ts              # 型定義・スキーマのテスト
```

**テスト内容:**

- 型安全性の検証
- スキーマバリデーションのテスト
- エラーハンドリングのテスト
- モック機能を使用したAPIコールのテスト
- Result型の動作確認

### 統合テスト (Integration Tests)

実際のOpenBD APIを呼び出すテストは `integrations/`
ディレクトリに配置されています。

```
integrations/
└── api_test.ts                # OpenBD API統合テスト
```

**テスト内容:**

- 実際のISBN検索
- 存在しないISBNの処理
- 複数ISBN検索
- カバレッジ取得
- パフォーマンステスト
- 並行リクエストテスト

### インポートテスト

公開APIのインポート可能性を確認するテストです。

```
mod_test.ts                    # モジュールエクスポートテスト
```

## テスト実行方法

### 単体テスト実行

```bash
# 単体テスト + インポートテスト（ネットワークアクセス不要）
deno task test

# または直接実行
deno test src/ mod_test.ts
```

### 統合テスト実行

```bash
# 統合テストのみ（ネットワークアクセス必要）
deno task test:integration

# または直接実行
deno test --allow-net integrations/

# 特定のテストファイル
deno test --allow-net integrations/api_test.ts
```

### 全てのテスト実行

```bash
# 単体テスト + 統合テスト
deno task test:all

# または手動で実行
deno task test && deno task test:integration
```

### 全チェック実行

```bash
# 型チェック + Lint + フォーマット + テスト
deno task check
```

## テスト戦略

### 1. 単体テスト戦略

- **関数型プログラミング**: 純粋関数を中心とした設計によりテストしやすい構造
- **Result型パターン**: neverthrowを使用したエラーハンドリングのテスト
- **モックテスト**: `@std/testing`を使用したネットワーク呼び出しのモック化
- **スキーマテスト**: Zod v4によるランタイム型検証のテスト

### 2. 統合テスト戦略

- **実環境テスト**: 実際のOpenBD APIサーバーとの通信テスト
- **パフォーマンステスト**: レスポンス時間の監視
- **エラーケーステスト**: ネットワークエラー、APIエラーの処理確認
- **並行処理テスト**: 同時リクエストの安定性確認

### 3. 型安全性テスト

- **TypeScript型検証**: コンパイル時の型チェック
- **ランタイム検証**: Zodスキーマによる実行時バリデーション
- **型ガード関数**: 実行時型判定の動作確認

## CI/CD での実行

### GitHub Actions

```yaml
# 単体テストのみ（通常のCI）
- name: Run unit tests
  run: deno task test

# 統合テストも含む（オプション）
- name: Run integration tests
  run: deno task test:integration

# 全テスト実行
- name: Run all tests
  run: deno task test:all
```

### ローカル開発

```bash
# 開発時の基本チェック（単体テストのみ）
deno task check

# 統合テストを含む完全テスト
deno task test:all

# 統合テストのみ実行
deno task test:integration
```

## テストデータ

### 使用するISBN

統合テストで使用する既知のISBN:

- `9784101092058` - 新編銀河鉄道の夜（新潮文庫）
- `9784062748895` - 人間失格（講談社文庫）
- `9781234567890` - 存在しないISBN（テスト用）

## トラブルシューティング

### よくある問題

1. **統合テストが失敗する**
   - ネットワーク接続を確認
   - `--allow-net` フラグが指定されているか確認
   - OpenBD APIサーバーの状態を確認

2. **型エラーが発生する**
   - `deno check **/*.ts` で型チェック実行
   - Zodスキーマの型注釈が正しいか確認

3. **モックテストが動作しない**
   - `@std/testing` の依存関係を確認
   - スタブの設定と復元が正しいか確認

### デバッグ方法

```bash
# 詳細な出力でテスト実行
deno test --allow-net --reporter=tap

# 特定のテストのみ実行
deno test --allow-net --filter="Integration: getBook"
```
