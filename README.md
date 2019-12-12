GoogleFontのsubsetのunicode-rangeを使って、任意のフォントをsubset化するスクリプトです

### セットアップ
nodeとpythonがインストールされて環境を前提としています。
```bash
pip install fonttools brotli
npm install
```

### 実行
プロジェクトルートにフォントを配置し、index.js内のオプションを書き換えてから実行します
```bash
npm run make
```
完了すると、dist配下にsubsetのwoff2ファイル群とそれらを参照するcssファイルが生成されます。