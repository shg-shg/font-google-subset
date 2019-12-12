GoogleFontのsubsetのunicode-rangeを使って、任意のフォントをsubset化するスクリプトです

## セットアップ
nodeとpythonがインストールされて環境を前提としています。
```bash
pip install fonttools brotli
npm install
```

## 実行
GoogleFontからcssを落としてきて、内部に書かれたrange-code
```bash
npm run make
```
