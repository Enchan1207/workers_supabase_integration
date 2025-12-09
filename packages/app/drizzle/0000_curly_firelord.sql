CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;