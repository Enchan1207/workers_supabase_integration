import { Hono } from 'hono'

import { jwkMiddleware } from './auth'

const app = new Hono()
  .basePath('/api')
  .use(jwkMiddleware)
  .get('/hello', (c) => {
    return c.json({ message: 'Hello, Cloudflare Workers!' })
  })

export default app
export type AppType = typeof app
