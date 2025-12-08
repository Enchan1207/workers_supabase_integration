# Cloudflare Workers with static assets (template)

## Overview

React SPA × Hono API backend on Cloudflare Workers and static assets

## Usage

### Bootstrap

0. direnv設定

   ```sh
   cp .envrc.sample .envrc
   # edit .envrc
   direnv allow
   ```

1. 依存関係のダウンロード

   ```sh
   pnpm i
   ```

2. devサーバの起動
   VSCodeを使用している場合は、タスク _server_ を起動してください。
   そうでない場合は `pnpm -F app dev` を実行してください。

   正常に起動したら、<http://localhost:5173>にアクセスすることでサイトを閲覧できます :partying_face:

### Deploy

このリポジトリではインフラ構成にTerraformを活用しています。
環境として `local`, `stg`, `prod` の3つが構成されています。

1. 構成準備

   ```sh
   terraform -chdir=infra/env/<env> init
   terraform -chdir=infra/env/<env> plan
   ```

2. リソース作成

   ```sh
   terraform -chdir=infra/env/<env> apply
   ```

   このコマンドにより、環境変数に追加で設定すべき値がoutputとして提供されます。
   以下のコマンドの出力を、各環境の `.env.<env>` に貼り付けてください。

   ```sh
   terraform -chdir=infra/env/<env> output
   ```

3. アプリケーションのデプロイ

   このリポジトリでは、インフラ構成をTerraform、ビルドをVite、デプロイをwranglerにそれぞれ担当させています。
   環境 `stg` および `prod` については、以下のコマンドでCloudflare Workersへデプロイされます。

   ```sh
   pnpm -F app deploy:<env>
   ```

4. リソースの破棄

   このリポジトリが管理するインフラを削除する場合は、以下を実行します。

   ```sh
   terraform -chdir=infra/env/<env> destroy
   ```

> [!NOTE]
>
> アプリケーションをデプロイする前にインフラを構成することを忘れないでください。

## License

This repository is published under [MIT License](LICENSE).
