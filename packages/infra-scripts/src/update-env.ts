import path from 'node:path'

import { Command } from 'commander'
import * as fs from 'fs/promises'

const Modes = ['development', 'staging', 'production'] as const

const options: Record<string, string | undefined> = new Command()
  .option('--mode <name>', 'mode')
  .parse()
  .opts()

/**
 * Terraformからの入力をパースして環境変数を更新する
 *
 * @note envファイルに存在しないキーを渡した場合は無視されます。
 */
const main = async (props: {
  modeRaw: string | undefined
}): Promise<number> => {
  const mode = parseMode(props.modeRaw)

  // Terraformからの入力をパース
  const data = await new Promise<string>((resolve) => {
    let data = ''
    process.stdin.on('data', (chunk) => (data += chunk.toString()))
    process.stdin.on('end', () => {
      resolve(data)
    })
  }).then((data) => JSON.parse(data) as Record<string, string>)
  const keys = Object.keys(data)

  // .envファイルを読み込む
  const envFilePath = path.join(import.meta.dirname, `../../app/.env.${mode}`)
  const envFileLines = await fs
    .readFile(envFilePath)
    .then((buf) => buf.toString().split('\n'))

  // Terraformの入力と合わせてマージ
  const updated = envFileLines.map((line) => {
    const matchedKey = keys.find((key) => line.startsWith(`${key}=`))

    if (matchedKey === undefined) {
      return line
    }

    return `${matchedKey}=${data[matchedKey]}`
  })

  await fs.writeFile(envFilePath, updated.join('\n'))

  return 0
}

/** 文字列からモードを取得 */
const parseMode = (raw: string | undefined): (typeof Modes)[number] => {
  if (raw === undefined) {
    throw new Error('no mode specified')
  }

  if (!(Modes as readonly string[]).includes(raw)) {
    throw new Error(`invalid mode specified: ${raw}`)
  }

  return raw as (typeof Modes)[number]
}

main({ modeRaw: options['mode'] })
  .then((c) => {
    console.log(JSON.stringify({ ok: 'true' }))
    process.exit(c)
  })
  .catch((e: unknown) => {
    const message = e instanceof Error ? e.message : 'Unknown error'
    console.log(JSON.stringify({ error: message }))
    process.exit(1)
  })
