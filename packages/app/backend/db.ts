import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import { env } from 'hono/adapter'
import { createMiddleware } from 'hono/factory'

type Variables = {
  drizzle: PostgresJsDatabase
}

export const dbMiddleware = createMiddleware<{
  Bindings: Env
  Variables: Variables
}>((c, next) => {
  const db = drizzle(env(c).DATABASE_URL)
  c.set('drizzle', db)

  return next()
})
