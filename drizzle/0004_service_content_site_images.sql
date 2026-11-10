CREATE TABLE `site_image` (
	`key` text PRIMARY KEY NOT NULL,
	`src` text NOT NULL,
	`alt` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `service` ADD `tagline` text;--> statement-breakpoint
ALTER TABLE `service` ADD `description` text;--> statement-breakpoint
ALTER TABLE `service` ADD `includes` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `service` ADD `dimensions` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `service` ADD `icon` text DEFAULT 'Sparkles' NOT NULL;--> statement-breakpoint
ALTER TABLE `service` ADD `image_url` text;--> statement-breakpoint
ALTER TABLE `service` ADD `image_alt` text;--> statement-breakpoint
ALTER TABLE `service` ADD `emergency_support` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `service` ADD `show_on_home` integer DEFAULT false NOT NULL;