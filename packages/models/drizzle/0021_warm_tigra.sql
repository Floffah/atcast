ALTER TABLE "episodes" DROP CONSTRAINT "episodes_public_id_unique";--> statement-breakpoint
/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'episodes'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

ALTER TABLE "episodes" DROP CONSTRAINT "episodes_pkey";--> statement-breakpoint
ALTER TABLE "episodes" ALTER COLUMN "id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_id_user_id_pk" PRIMARY KEY("id","user_id");--> statement-breakpoint
ALTER TABLE "episodes" DROP COLUMN "public_id";--> statement-breakpoint
ALTER TABLE "episodes" ADD CONSTRAINT "episodes_id_unique" UNIQUE("id");