import path from 'node:path'

import { Command } from 'commander'

const program = new Command().option('--mode <name>', 'mode')
program.parse()

const options: Record<string, string> = program.opts()
const mode = options['mode']

// Terraformからの入力をJSONパース
const data = await new Promise<string>((resolve) => {
  let data = ''
  process.stdin.on('data', (chunk) => (data += chunk.toString()))
  process.stdin.on('end', () => {
    resolve(data)
  })
}).then((data) => JSON.parse(data) as Record<string, string>)

const p = path.join(import.meta.dirname, '../../app/.env.development')
console.log(p)

process.stdout.write(JSON.stringify(data))
