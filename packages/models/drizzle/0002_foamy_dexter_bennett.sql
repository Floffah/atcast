ALTER TABLE "user_sessions" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "handle" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD COLUMN "pcke_verifier" varchar(128) NOT NULL;