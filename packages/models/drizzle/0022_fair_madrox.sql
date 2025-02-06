CREATE TABLE "audio_uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" serial NOT NULL,
	"episode_id" varchar(36) NOT NULL,
	"ut_file_key" varchar(255),
	"processing" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audio_uploads" ADD CONSTRAINT "audio_uploads_user_id_episode_id_episodes_user_id_id_fk" FOREIGN KEY ("user_id","episode_id") REFERENCES "public"."episodes"("user_id","id") ON DELETE cascade ON UPDATE no action;