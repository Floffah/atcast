ALTER TABLE "audio_process_requests" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;