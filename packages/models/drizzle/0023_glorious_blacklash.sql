ALTER TABLE "audio_uploads" RENAME TO "audio_process_requests";--> statement-breakpoint
ALTER TABLE "audio_process_requests" DROP CONSTRAINT "audio_uploads_user_id_episode_id_episodes_user_id_id_fk";
--> statement-breakpoint
ALTER TABLE "audio_process_requests" ALTER COLUMN "id" SET DATA TYPE varchar(36);--> statement-breakpoint
ALTER TABLE "audio_process_requests" ADD CONSTRAINT "audio_process_requests_user_id_episode_id_episodes_user_id_id_fk" FOREIGN KEY ("user_id","episode_id") REFERENCES "public"."episodes"("user_id","id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audio_process_requests" ADD CONSTRAINT "audio_process_requests_id_unique" UNIQUE("id");