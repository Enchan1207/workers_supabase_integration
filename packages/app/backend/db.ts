import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from 'hono/adapter'
import { createMiddleware } from 'hono/factory'
import postgres from 'postgres'

type Variables = {
  drizzle: PostgresJsDatabase
}

export const dbMiddleware = createMiddleware<{
  Bindings: Env
  Variables: Variables
}>((c, next) => {
  const client = postgres(env(c).DATABASE_URL, { prepare: false })
  const db = drizzle({ client })
  c.set('drizzle', db)

  return next()
})
