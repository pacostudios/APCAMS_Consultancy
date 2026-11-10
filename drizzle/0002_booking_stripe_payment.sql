ALTER TABLE `booking` ADD `hold_expires_at` integer;--> statement-breakpoint
ALTER TABLE `booking` ADD `stripe_checkout_session_id` text;--> statement-breakpoint
ALTER TABLE `booking` ADD `stripe_payment_intent_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `booking_stripe_checkout_session_id_unique` ON `booking` (`stripe_checkout_session_id`);