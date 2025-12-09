# Cloudflare Workers と supabase を統合する

## Overview

SSIA

## Usage

### インフラ

環境 `local`, `stg`, `prod` が構成されています。

```sh
terraform -chdir=infra/env/<env> init
terraform -chdir=infra/env/<env> apply
```

`output` で出力される値を `.env.<env>` に記載します。

```sh
terraform -chdir=infra/env/<env> output
```

インフラ側の機密情報は `.env.<env>.local` に出力されます。

### デプロイ

アプリケーションとシークレットは別のコマンドでデプロイします。

```sh
# deploy application
pnpm -F app deploy:<env>
# deploy secret
pnpm -F app deploy:<env>:secret
```

### マイグレーション

```sh
docker compose up -d
```

`drizzle-kit` を使う際は、変数 `MODE` を指定します。指定しなかった場合はローカル環境が操作対象になります。

```sh
pnpm -F app exec drizzle-kit generate
MODE=staging pnpm -F app exec drizzle-kit migrate
```

## License

This repository is generated from template [Enchan1207/worker_static_assets_template](https://github.com/Enchan1207/worker_static_assets_template), and published under [MIT License](LICENSE).
