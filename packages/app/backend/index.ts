import { Hono } from 'hono'

import { jwkMiddleware } from './auth'
import { dbMiddleware } from './db'

const app = new Hono()
  .basePath('/api')
  .use(jwkMiddleware)
  .use(dbMiddleware)
  .get('/hello', (c) => {
    return c.json({ message: 'Hello, Cloudflare Workers!' })
  })

export default app
export type AppType = typeof app
