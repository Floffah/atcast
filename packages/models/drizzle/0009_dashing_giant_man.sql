ALTER TABLE "users" ADD COLUMN "public_id" varchar(36) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_public_id_unique" UNIQUE("public_id");