ALTER TABLE "audio_process_requests" ADD COLUMN "started_processing_at" timestamp;--> statement-breakpoint
ALTER TABLE "audio_process_requests" ADD COLUMN "errorMessage" text;--> statement-breakpoint
ALTER TABLE "audio_process_requests" DROP COLUMN "processing";