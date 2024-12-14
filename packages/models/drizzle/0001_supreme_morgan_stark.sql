ALTER TABLE "users" DROP CONSTRAINT "users_public_id_unique";--> statement-breakpoint
ALTER TABLE "user_oauth_providers" ALTER COLUMN "provider_user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "did" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "public_id";--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_did_unique" UNIQUE("did");