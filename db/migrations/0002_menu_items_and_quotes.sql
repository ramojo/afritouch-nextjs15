-- Priced dish catalog + custom-menu fields on quotes.

CREATE TYPE "public"."quote_kind" AS ENUM('package', 'custom');--> statement-breakpoint
CREATE TYPE "public"."menu_item_category" AS ENUM('starch', 'protein', 'vegetables', 'dessert', 'drinks');--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" "menu_item_category" NOT NULL,
	"price_per_person" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"needs_costing" boolean DEFAULT false NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "kind" "quote_kind" DEFAULT 'package' NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "line_items" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN "estimated_total" integer;--> statement-breakpoint
CREATE INDEX "menu_items_category_idx" ON "menu_items" USING btree ("category");--> statement-breakpoint
CREATE INDEX "menu_items_active_idx" ON "menu_items" USING btree ("active");--> statement-breakpoint
CREATE INDEX "menu_items_needs_costing_idx" ON "menu_items" USING btree ("needs_costing");--> statement-breakpoint
CREATE UNIQUE INDEX "menu_items_category_name_idx" ON "menu_items" USING btree ("category", "name");
