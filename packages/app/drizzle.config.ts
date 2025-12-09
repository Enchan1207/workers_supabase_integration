import { defineConfig } from 'drizzle-kit'
import { loadEnv } from 'vite'

// NOTE: シェル変数MODEを設定して環境を切り替え
const mode = process.env['MODE'] ?? 'development'
console.log(`Mode: ${mode}`)

const env = loadEnv(mode, process.cwd(), '')

export default defineConfig({
  out: './drizzle',
  schema: ['./backend/schema.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
