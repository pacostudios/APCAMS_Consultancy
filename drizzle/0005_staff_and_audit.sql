CREATE TABLE `audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`booking_id` integer,
	`staff_id` integer,
	`actor_user_id` text,
	`actor_name` text NOT NULL,
	`actor_role` text NOT NULL,
	`action` text NOT NULL,
	`summary` text NOT NULL,
	`details` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`booking_id`) REFERENCES `booking`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`actor_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `audit_booking_idx` ON `audit_log` (`booking_id`);--> statement-breakpoint
CREATE INDEX `audit_staff_idx` ON `audit_log` (`staff_id`);--> statement-breakpoint
CREATE INDEX `audit_created_idx` ON `audit_log` (`created_at`);--> statement-breakpoint
CREATE TABLE `staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`title` text,
	`phone` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staff_user_id_unique` ON `staff` (`user_id`);--> statement-breakpoint
CREATE TABLE `staff_hours` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`staff_id` integer NOT NULL,
	`weekday` integer NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `staff_hours_staff_idx` ON `staff_hours` (`staff_id`);--> statement-breakpoint
CREATE TABLE `staff_service` (
	`staff_id` integer NOT NULL,
	`service_id` integer NOT NULL,
	PRIMARY KEY(`staff_id`, `service_id`),
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`service_id`) REFERENCES `service`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `staff_service_service_idx` ON `staff_service` (`service_id`);--> statement-breakpoint
CREATE TABLE `staff_time_off` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`staff_id` integer NOT NULL,
	`date` text NOT NULL,
	`reason` text,
	FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `staff_time_off_uq` ON `staff_time_off` (`staff_id`,`date`);--> statement-breakpoint
DROP INDEX `booking_active_start_uq`;--> statement-breakpoint
ALTER TABLE `booking` ADD `staff_id` integer REFERENCES staff(id);--> statement-breakpoint
CREATE UNIQUE INDEX `booking_staff_start_uq` ON `booking` (`staff_id`,`starts_at`) WHERE status <> 'cancelled';--> statement-breakpoint
CREATE INDEX `booking_staff_idx` ON `booking` (`staff_id`);