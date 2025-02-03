CREATE TABLE "episodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(36) NOT NULL,
	"user_id" serial NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "episodes_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "name" TO "handle";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_name_unique";--> statement-breakpoint
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_handle_unique" UNIQUE("handle");