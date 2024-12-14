CREATE TABLE "user_auth_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"handle" varchar(256) NOT NULL,
	"pkce_verifier" varchar(128) NOT NULL,
	"dpop_public_key" varchar(512) NOT NULL,
	"dpop_private_key" varchar(512) NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_sessions" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_sessions" DROP COLUMN "handle";--> statement-breakpoint
ALTER TABLE "user_sessions" DROP COLUMN "pkce_verifier";