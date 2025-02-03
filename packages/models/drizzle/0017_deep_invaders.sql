ALTER TABLE "show_collaborators" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "shows" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "show_collaborators" CASCADE;--> statement-breakpoint
DROP TABLE "shows" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();