import { integer, pgTable, text } from 'drizzle-orm/pg-core'

export const postsTable = pgTable('posts', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  content: text().notNull(),
}).enableRLS()
