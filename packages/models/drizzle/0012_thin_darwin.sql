CREATE TABLE "show_collaborators" (
	"user_id" integer NOT NULL,
	"show_id" integer NOT NULL,
	CONSTRAINT "show_collaborators_user_id_show_id_pk" PRIMARY KEY("user_id","show_id")
);
--> statement-breakpoint
CREATE TABLE "shows" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" varchar(36) NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(1024),
	"last_episode" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "shows_public_id_unique" UNIQUE("public_id")
);
--> statement-breakpoint
ALTER TABLE "show_collaborators" ADD CONSTRAINT "show_collaborators_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "show_collaborators" ADD CONSTRAINT "show_collaborators_show_id_shows_id_fk" FOREIGN KEY ("show_id") REFERENCES "public"."shows"("id") ON DELETE cascade ON UPDATE no action;