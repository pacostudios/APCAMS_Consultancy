ALTER TABLE `booking` ADD `amount_paid_cents` integer;--> statement-breakpoint
ALTER TABLE `booking` ADD `paid_at` integer;--> statement-breakpoint
ALTER TABLE `booking` ADD `payment_method` text;--> statement-breakpoint
ALTER TABLE `booking` ADD `receipt_url` text;--> statement-breakpoint
ALTER TABLE `booking` ADD `refunded_at` integer;