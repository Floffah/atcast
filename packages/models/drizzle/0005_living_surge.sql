ALTER TABLE "user_auth_requests" ADD COLUMN "state" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "user_auth_requests" ADD COLUMN "jwk" json;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "access_token" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "refresh_token" varchar(256);--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "jwk" json;--> statement-breakpoint
ALTER TABLE "user_auth_requests" DROP COLUMN "dpop_public_key";--> statement-breakpoint
ALTER TABLE "user_auth_requests" DROP COLUMN "dpop_private_key";