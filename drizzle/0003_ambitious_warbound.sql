CREATE TYPE "public"."game_size_type" AS ENUM('MB', 'GB');--> statement-breakpoint
CREATE TABLE "games" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"size" numeric(10, 2) NOT NULL,
	"size_type" "game_size_type" NOT NULL,
	"publisher" text NOT NULL,
	"rating" numeric(2, 1) NOT NULL,
	"image_url" text NOT NULL,
	"genre" text NOT NULL,
	"platform" text NOT NULL,
	"release_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
