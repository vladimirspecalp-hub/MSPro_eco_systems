CREATE TABLE `calculations` (
	`id` varchar(36) NOT NULL DEFAULT (uuid()),
	`service_type` text NOT NULL,
	`height` decimal(10,2),
	`diameter` decimal(10,2),
	`surface_area` decimal(10,2),
	`coating_type` text,
	`estimated_cost` decimal(10,2),
	`lead_id` varchar(36),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `calculations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` varchar(36) NOT NULL DEFAULT (uuid()),
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`service_type` text NOT NULL,
	`message` text,
	`source` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news_articles` (
	`id` varchar(36) NOT NULL DEFAULT (uuid()),
	`external_id` varchar(255),
	`slug` varchar(255) NOT NULL,
	`title` text NOT NULL,
	`excerpt` text,
	`content_markdown` text,
	`content_html` text,
	`content` text NOT NULL,
	`cover_image` text,
	`author` varchar(255) DEFAULT 'MSPRO',
	`category` varchar(100),
	`tags` json,
	`geo_region_code` varchar(50),
	`geo_city` varchar(255),
	`status` varchar(50) NOT NULL DEFAULT 'draft',
	`published_at` timestamp,
	`canonical_url` text,
	`meta_title` text,
	`meta_description` text,
	`meta_keywords` json,
	`og_image` text,
	`json_ld` text,
	`aeo_answer_block` text,
	`aeo_faq` text,
	`source_type` varchar(100),
	`source_ref` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `news_articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `news_articles_external_id_unique` UNIQUE(`external_id`),
	CONSTRAINT `news_articles_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `news_outbox` (
	`id` varchar(36) NOT NULL DEFAULT (uuid()),
	`article_id` varchar(36) NOT NULL,
	`platform` varchar(100) NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'queued',
	`payload` text,
	`external_id` varchar(255),
	`external_url` text,
	`backlink_url` text,
	`error_message` text,
	`attempts` int DEFAULT 0,
	`scheduled_at` timestamp,
	`posted_at` timestamp,
	`processed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `news_outbox_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `calculations` ADD CONSTRAINT `calculations_lead_id_leads_id_fk` FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `news_outbox` ADD CONSTRAINT `news_outbox_article_id_news_articles_id_fk` FOREIGN KEY (`article_id`) REFERENCES `news_articles`(`id`) ON DELETE no action ON UPDATE no action;