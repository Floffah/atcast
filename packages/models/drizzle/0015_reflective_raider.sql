CREATE TYPE "public"."show_collaborator_type" AS ENUM('OWNER', 'COLLABORATOR');--> statement-breakpoint
ALTER TABLE "show_collaborators" ADD COLUMN "type" "show_collaborator_type" NOT NULL;