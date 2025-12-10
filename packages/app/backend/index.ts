import { zValidator } from '@hono/zod-validator'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import z from 'zod'

import { jwkMiddleware } from './auth'
import { dbMiddleware } from './db'
import { postsTable } from './schema'

const app = new Hono()
  .basePath('/api')
  .use(jwkMiddleware)
  .use(dbMiddleware)
  .get('/posts', async (c) => {
    const records = await c.get('drizzle').select().from(postsTable)

    return c.json({ items: records })
  })
  .get(
    '/posts/:id',
    zValidator('param', z.object({ id: z.coerce.number() })),
    async (c) => {
      const id = c.req.valid('param').id
      const item = await c
        .get('drizzle')
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, id))
        .then((records) => records.at(0))

      if (item === undefined) {
        return c.json({ message: 'Not Found' }, 404)
      }

      return c.json(item)
    },
  )
  .post(
    '/posts',
    zValidator(
      'json',
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
      }),
    ),
    async (c) => {
      const body = c.req.valid('json')

      const inserted = await c
        .get('drizzle')
        .insert(postsTable)
        .values({
          title: body.title,
          content: body.content,
        })
        .returning()

      return c.json(inserted, 201)
    },
  )

export default app
export type AppType = typeof app
