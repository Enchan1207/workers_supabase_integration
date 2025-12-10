import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

export const postsTable = pgTable(
  'posts',
  {
    id: text().notNull(),
    user_id: text().notNull(),
    title: text().notNull(),
    content: text().notNull(),
  },
  (table) => [primaryKey({ columns: [table.id, table.user_id] })],
).enableRLS()
