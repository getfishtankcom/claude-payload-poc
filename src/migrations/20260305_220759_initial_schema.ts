import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'fr');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'author');
  CREATE TYPE "public"."enum_boards_resources_type" AS ENUM('pdf', 'word', 'link', 'video');
  CREATE TYPE "public"."enum_standards_category" AS ENUM('Sustainability', 'Accounting', 'Public Sector', 'Assurance');
  CREATE TYPE "public"."enum_projects_badges_badge_type" AS ENUM('Exposure Draft', 'Public Comment', 'Survey', 'Research', 'Re-exposure Draft');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('Active', 'Completed', 'Paused');
  CREATE TYPE "public"."enum_projects_type" AS ENUM('Active', 'Completed');
  CREATE TYPE "public"."enum_consultations_action_documents_type" AS ENUM('pdf', 'word', 'link');
  CREATE TYPE "public"."enum_consultations_type" AS ENUM('Exposure Draft', 'Survey', 'Re-exposure Draft');
  CREATE TYPE "public"."enum_news_category" AS ENUM('Document for Comment', 'International Activity', 'Meeting Summary', 'News', 'Resource');
  CREATE TYPE "public"."enum_events_type" AS ENUM('meeting', 'event', 'webinar', 'decision-summary');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_documents_type" AS ENUM('Exposure Draft', 'Implementation Guide', 'Background Paper', 'Research Report', 'Guidance', 'Standard');
  CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_cta_links_link_appearance" AS ENUM('default', 'outline', 'ghost');
  CREATE TYPE "public"."enum_pages_blocks_cta_variant" AS ENUM('light', 'dark', 'purple');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_pages_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_news_grid_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_pages_sidebar_type" AS ENUM('staff_contact', 'section_nav', 'none');
  CREATE TYPE "public"."enum_pages_page_layout" AS ENUM('default', 'simple-content');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'lowImpact');
  CREATE TYPE "public"."enum_pages_cta_block_variant" AS ENUM('light', 'dark-purple');
  CREATE TYPE "public"."enum_board_members_role" AS ENUM('chair', 'vice-chair', 'voting-member', 'non-voting');
  CREATE TYPE "public"."enum_committees_status" AS ENUM('active', 'inactive', 'archived');
  CREATE TYPE "public"."enum_resources_category" AS ENUM('Article', 'Guidance', 'In Brief', 'Other', 'Webinar');
  CREATE TYPE "public"."enum_resources_resource_type" AS ENUM('Audio', 'External Link', 'PDF', 'Video', 'Webpage', 'Plain Language');
  CREATE TYPE "public"."enum_resources_status" AS ENUM('draft', 'published', 'archived');
  CREATE TYPE "public"."enum_documents_for_comment_group" AS ENUM('exposure-draft', 'consultation-paper', 're-exposure-draft', 'discussion-paper');
  CREATE TYPE "public"."enum_documents_for_comment_status" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum_document_details_support_materials_file_type" AS ENUM('pdf', 'word', 'excel', 'link');
  CREATE TYPE "public"."enum_form_submissions_status" AS ENUM('new', 'read', 'replied');
  CREATE TYPE "public"."enum_job_postings_status" AS ENUM('draft', 'published', 'closed');
  CREATE TYPE "public"."enum_standards_sections_feature_c_t_as_variant" AS ENUM('light', 'dark-purple');
  CREATE TYPE "public"."enum_homepage_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_homepage_hero_links_link_appearance" AS ENUM('default', 'outline', 'ghost');
  CREATE TYPE "public"."enum_homepage_blocks_cta_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_homepage_blocks_cta_links_link_appearance" AS ENUM('default', 'outline', 'ghost');
  CREATE TYPE "public"."enum_homepage_blocks_cta_variant" AS ENUM('light', 'dark', 'purple');
  CREATE TYPE "public"."enum_homepage_blocks_content_columns_size" AS ENUM('oneThird', 'half', 'twoThirds', 'full');
  CREATE TYPE "public"."enum_homepage_blocks_content_columns_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_homepage_blocks_news_grid_populate_by" AS ENUM('collection', 'selection');
  CREATE TYPE "public"."enum_homepage_hero_type" AS ENUM('none', 'highImpact', 'lowImpact');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'author' NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "boards_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL
  );
  
  CREATE TABLE "boards_tabs_locales" (
  	"label" varchar NOT NULL,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "boards_quick_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"icon" varchar
  );
  
  CREATE TABLE "boards_quick_actions_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "boards_resources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"file_url" varchar NOT NULL,
  	"type" "enum_boards_resources_type"
  );
  
  CREATE TABLE "boards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"abbreviation" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "boards_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "standards_parts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL
  );
  
  CREATE TABLE "standards_parts_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "standards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "enum_standards_category" NOT NULL,
  	"board_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "standards_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_badges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"badge_type" "enum_projects_badges_badge_type"
  );
  
  CREATE TABLE "projects_timeline_stages_ctas" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "projects_timeline_stages_ctas_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects_timeline_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"phase_number" numeric NOT NULL,
  	"date" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_timeline_stages_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_projects_status" NOT NULL,
  	"current_stage" numeric,
  	"type" "enum_projects_type",
  	"fras_id_number" varchar,
  	"board_id" integer NOT NULL,
  	"standard_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar NOT NULL,
  	"summary" jsonb,
  	"key_proposals" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"documents_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "consultations_action_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"type" "enum_consultations_action_documents_type"
  );
  
  CREATE TABLE "consultations_action_documents_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "consultations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_consultations_type" NOT NULL,
  	"deadline_date" timestamp(3) with time zone NOT NULL,
  	"comment_period_start" timestamp(3) with time zone,
  	"comment_period_end" timestamp(3) with time zone,
  	"fras_id_number" varchar,
  	"board_id" integer NOT NULL,
  	"standard_id" integer,
  	"project_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "consultations_locales" (
  	"title" varchar NOT NULL,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"category" "enum_news_category",
  	"featured_image_id" integer,
  	"external_url" varchar,
  	"is_volunteer_opportunity" boolean DEFAULT false,
  	"fras_id_number" varchar,
  	"board_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "news_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"published_date" timestamp(3) with time zone,
  	"type" "enum_events_type" NOT NULL,
  	"status" "enum_events_status" DEFAULT 'draft' NOT NULL,
  	"registration_url" varchar,
  	"board_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_documents_type" NOT NULL,
  	"file_id" integer,
  	"board_id" integer,
  	"standard_id" integer,
  	"project_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "documents_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "decision_summaries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"board_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "decision_summaries_locales" (
  	"title" varchar NOT NULL,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"phone" varchar,
  	"email" varchar,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "contacts_locales" (
  	"name" varchar NOT NULL,
  	"credentials" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL,
  	"link_appearance" "enum_pages_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"variant" "enum_pages_blocks_cta_variant" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_pages_blocks_content_columns_size" DEFAULT 'full',
  	"rich_text" jsonb,
  	"link_type" "enum_pages_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_news_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"news_count" numeric DEFAULT 3,
  	"show_view_all" boolean DEFAULT true,
  	"populate_by" "enum_pages_blocks_news_grid_populate_by" DEFAULT 'collection',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_browse_by_standard_categories_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_browse_by_standard_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_browse_by_standard" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_section_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"is_active" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_section_nav_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"sidebar_type" "enum_pages_sidebar_type" DEFAULT 'none',
  	"page_layout" "enum_pages_page_layout" DEFAULT 'default',
  	"board_id" integer,
  	"hero_type" "enum_pages_hero_type" DEFAULT 'none' NOT NULL,
  	"hero_rich_text" jsonb,
  	"hero_media_id" integer,
  	"hero_search_enabled" boolean DEFAULT false,
  	"cta_block_button_href" varchar,
  	"cta_block_variant" "enum_pages_cta_block_variant" DEFAULT 'light',
  	"news_section" boolean DEFAULT false,
  	"form_config_captcha_enabled" boolean DEFAULT true,
  	"media_inquiries_contact_email" varchar,
  	"media_inquiries_contact_phone" varchar,
  	"meta_meta_title" varchar,
  	"meta_meta_description" varchar,
  	"meta_og_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar NOT NULL,
  	"cta_block_heading" varchar,
  	"cta_block_description" varchar,
  	"cta_block_button_label" varchar,
  	"media_inquiries_heading" varchar DEFAULT 'Media Inquiries',
  	"media_inquiries_contact_name" varchar,
  	"media_inquiries_contact_title" varchar,
  	"listing_heading" varchar,
  	"empty_state_message" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"news_id" integer,
  	"contacts_id" integer
  );
  
  CREATE TABLE "board_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"role" "enum_board_members_role" NOT NULL,
  	"appointed_date" timestamp(3) with time zone,
  	"term_expires" timestamp(3) with time zone,
  	"bio_page_id" integer,
  	"sort_order" numeric DEFAULT 0,
  	"board_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "board_members_locales" (
  	"name" varchar NOT NULL,
  	"credentials" varchar,
  	"role_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "committees_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "committees_members_locales" (
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"organization" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "committees_meeting_reports" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"file_id" integer
  );
  
  CREATE TABLE "committees_meeting_reports_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "committees" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"sort_order" numeric DEFAULT 0,
  	"detail_page_url" varchar,
  	"status" "enum_committees_status" DEFAULT 'active' NOT NULL,
  	"board_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "committees_locales" (
  	"name" varchar NOT NULL,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "resources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"date" timestamp(3) with time zone,
  	"category" "enum_resources_category" NOT NULL,
  	"resource_type" "enum_resources_resource_type",
  	"external_url" varchar,
  	"file_id" integer,
  	"status" "enum_resources_status" DEFAULT 'draft' NOT NULL,
  	"board_id" integer NOT NULL,
  	"standard_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "resources_locales" (
  	"title" varchar NOT NULL,
  	"excerpt" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "effective_dates_sections_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"footnote_ref" varchar
  );
  
  CREATE TABLE "effective_dates_sections_rows_locales" (
  	"application" jsonb NOT NULL,
  	"pronouncement" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "effective_dates_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"header_date" timestamp(3) with time zone,
  	"sort_order" numeric DEFAULT 0
  );
  
  CREATE TABLE "effective_dates_sections_locales" (
  	"header_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "effective_dates_footnotes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"marker" varchar NOT NULL
  );
  
  CREATE TABLE "effective_dates_footnotes_locales" (
  	"text" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "effective_dates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"standard_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "effective_dates_locales" (
  	"title" varchar NOT NULL,
  	"intro_text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "documents_for_comment" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"fras_id_number" varchar,
  	"group" "enum_documents_for_comment_group" NOT NULL,
  	"status" "enum_documents_for_comment_status" DEFAULT 'open' NOT NULL,
  	"document_url" varchar,
  	"comment_submit_url" varchar,
  	"comments_pdf_url" varchar,
  	"sort_order" numeric DEFAULT 0,
  	"published_date" timestamp(3) with time zone,
  	"comment_period_start" timestamp(3) with time zone,
  	"comment_period_end" timestamp(3) with time zone,
  	"standard_id" integer,
  	"board_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "documents_for_comment_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "document_details_comment_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question_number" numeric NOT NULL
  );
  
  CREATE TABLE "document_details_comment_questions_locales" (
  	"question_text" jsonb NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "document_details_support_materials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"file_type" "enum_document_details_support_materials_file_type"
  );
  
  CREATE TABLE "document_details_support_materials_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "document_details" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"reply_deadline" timestamp(3) with time zone,
  	"how_to_reply_cta_href" varchar,
  	"how_to_reply_contact_email" varchar,
  	"standard_id" integer,
  	"board_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "document_details_locales" (
  	"title" varchar NOT NULL,
  	"highlights" jsonb,
  	"body_content" jsonb,
  	"how_to_reply_heading" varchar DEFAULT 'How to Reply',
  	"how_to_reply_body" jsonb,
  	"how_to_reply_cta_label" varchar,
  	"how_to_reply_contact_name" varchar,
  	"how_to_reply_contact_title" varchar,
  	"how_to_reply_contact_address" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "document_details_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"contacts_id" integer
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"full_name" varchar NOT NULL,
  	"title" varchar,
  	"organization" varchar,
  	"email" varchar NOT NULL,
  	"business_phone" varchar,
  	"comments" varchar NOT NULL,
  	"submitted_at" timestamp(3) with time zone NOT NULL,
  	"status" "enum_form_submissions_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_postings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"posted_date" timestamp(3) with time zone,
  	"closing_date" timestamp(3) with time zone,
  	"external_url" varchar,
  	"status" "enum_job_postings_status" DEFAULT 'draft' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "job_postings_locales" (
  	"title" varchar NOT NULL,
  	"department" varchar,
  	"location" varchar,
  	"description" jsonb,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "standards_sections_tabs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"is_active" boolean DEFAULT false
  );
  
  CREATE TABLE "standards_sections_tabs_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "standards_sections_feature_c_t_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_href" varchar,
  	"variant" "enum_standards_sections_feature_c_t_as_variant" DEFAULT 'light'
  );
  
  CREATE TABLE "standards_sections_feature_c_t_as_locales" (
  	"heading" varchar NOT NULL,
  	"description" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "standards_sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"board_logo_id" integer,
  	"board_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "standards_sections_locales" (
  	"title" varchar NOT NULL,
  	"board_name" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "standards_sections_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"boards_id" integer,
  	"standards_id" integer,
  	"projects_id" integer,
  	"consultations_id" integer,
  	"news_id" integer,
  	"events_id" integer,
  	"documents_id" integer,
  	"decision_summaries_id" integer,
  	"contacts_id" integer,
  	"pages_id" integer,
  	"board_members_id" integer,
  	"committees_id" integer,
  	"resources_id" integer,
  	"effective_dates_id" integer,
  	"documents_for_comment_id" integer,
  	"document_details_id" integer,
  	"form_submissions_id" integer,
  	"job_postings_id" integer,
  	"standards_sections_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "navigation_utility_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"has_dropdown" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_utility_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_primary_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL,
  	"has_dropdown" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_primary_nav_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_mega_menu_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_mega_menu_columns_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_mega_menu_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "navigation_mega_menu_columns_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_mega_menu" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "navigation_mega_menu_locales" (
  	"trigger_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "footer_columns_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_boards_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_boards_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer_quick_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "footer_quick_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer_locales" (
  	"newsletter_heading" varchar,
  	"newsletter_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "homepage_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_homepage_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_homepage_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "homepage_blocks_cta_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_homepage_blocks_cta_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL,
  	"link_appearance" "enum_homepage_blocks_cta_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "homepage_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb,
  	"variant" "enum_homepage_blocks_cta_variant" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_content_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"size" "enum_homepage_blocks_content_columns_size" DEFAULT 'full',
  	"rich_text" jsonb,
  	"link_type" "enum_homepage_blocks_content_columns_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"rich_text" jsonb NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_news_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"news_count" numeric DEFAULT 3,
  	"show_view_all" boolean DEFAULT true,
  	"populate_by" "enum_homepage_blocks_news_grid_populate_by" DEFAULT 'collection',
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_browse_by_standard_categories_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_browse_by_standard_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_browse_by_standard" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_type" "enum_homepage_hero_type" DEFAULT 'none' NOT NULL,
  	"hero_rich_text" jsonb,
  	"hero_media_id" integer,
  	"hero_search_enabled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"news_id" integer
  );
  
  CREATE TABLE "search_config_popular_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"query" varchar NOT NULL
  );
  
  CREATE TABLE "search_config_popular_tags_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "search_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"default_filters" jsonb,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "auth_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"forgot_username_url" varchar,
  	"forgot_password_url" varchar,
  	"register_url" varchar,
  	"cpa_login_url" varchar,
  	"support_email" varchar,
  	"support_phone_toll_free" varchar,
  	"support_phone_intl" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "auth_config_locales" (
  	"username_label" varchar DEFAULT 'Username',
  	"password_label" varchar DEFAULT 'Password',
  	"button_label" varchar DEFAULT 'Log In',
  	"forgot_username_label" varchar DEFAULT 'Forgot Username?',
  	"forgot_password_label" varchar DEFAULT 'Forgot Password?',
  	"register_prompt" varchar DEFAULT 'Don''t have an account?',
  	"register_link_label" varchar DEFAULT 'Register',
  	"cpa_explanation" jsonb,
  	"support_heading" varchar DEFAULT 'Need Help?',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "boards_tabs" ADD CONSTRAINT "boards_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "boards_tabs_locales" ADD CONSTRAINT "boards_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."boards_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "boards_quick_actions" ADD CONSTRAINT "boards_quick_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "boards_quick_actions_locales" ADD CONSTRAINT "boards_quick_actions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."boards_quick_actions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "boards_resources" ADD CONSTRAINT "boards_resources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "boards_locales" ADD CONSTRAINT "boards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "standards_parts" ADD CONSTRAINT "standards_parts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."standards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "standards_parts_locales" ADD CONSTRAINT "standards_parts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."standards_parts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "standards" ADD CONSTRAINT "standards_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "standards_locales" ADD CONSTRAINT "standards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."standards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_badges" ADD CONSTRAINT "projects_badges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_timeline_stages_ctas" ADD CONSTRAINT "projects_timeline_stages_ctas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_timeline_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_timeline_stages_ctas_locales" ADD CONSTRAINT "projects_timeline_stages_ctas_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_timeline_stages_ctas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_timeline_stages" ADD CONSTRAINT "projects_timeline_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_timeline_stages_locales" ADD CONSTRAINT "projects_timeline_stages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_timeline_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_standard_id_standards_id_fk" FOREIGN KEY ("standard_id") REFERENCES "public"."standards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "consultations_action_documents" ADD CONSTRAINT "consultations_action_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."consultations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "consultations_action_documents_locales" ADD CONSTRAINT "consultations_action_documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."consultations_action_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "consultations" ADD CONSTRAINT "consultations_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultations" ADD CONSTRAINT "consultations_standard_id_standards_id_fk" FOREIGN KEY ("standard_id") REFERENCES "public"."standards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultations" ADD CONSTRAINT "consultations_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "consultations_locales" ADD CONSTRAINT "consultations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."consultations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news" ADD CONSTRAINT "news_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_locales" ADD CONSTRAINT "news_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_standard_id_standards_id_fk" FOREIGN KEY ("standard_id") REFERENCES "public"."standards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents_locales" ADD CONSTRAINT "documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "decision_summaries" ADD CONSTRAINT "decision_summaries_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "decision_summaries_locales" ADD CONSTRAINT "decision_summaries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."decision_summaries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contacts" ADD CONSTRAINT "contacts_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "contacts_locales" ADD CONSTRAINT "contacts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta_links" ADD CONSTRAINT "pages_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content_columns" ADD CONSTRAINT "pages_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_content" ADD CONSTRAINT "pages_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_news_grid" ADD CONSTRAINT "pages_blocks_news_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_browse_by_standard_categories_links" ADD CONSTRAINT "pages_blocks_browse_by_standard_categories_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_browse_by_standard_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_browse_by_standard_categories" ADD CONSTRAINT "pages_blocks_browse_by_standard_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_browse_by_standard"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_browse_by_standard" ADD CONSTRAINT "pages_blocks_browse_by_standard_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_section_nav_links" ADD CONSTRAINT "pages_section_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_section_nav_links_locales" ADD CONSTRAINT "pages_section_nav_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_section_nav_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_og_image_id_media_id_fk" FOREIGN KEY ("meta_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "board_members" ADD CONSTRAINT "board_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "board_members" ADD CONSTRAINT "board_members_bio_page_id_pages_id_fk" FOREIGN KEY ("bio_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "board_members" ADD CONSTRAINT "board_members_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "board_members_locales" ADD CONSTRAINT "board_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."board_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "committees_members" ADD CONSTRAINT "committees_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "committees_members_locales" ADD CONSTRAINT "committees_members_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."committees_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "committees_meeting_reports" ADD CONSTRAINT "committees_meeting_reports_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committees_meeting_reports" ADD CONSTRAINT "committees_meeting_reports_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "committees_meeting_reports_locales" ADD CONSTRAINT "committees_meeting_reports_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."committees_meeting_reports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "committees" ADD CONSTRAINT "committees_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "committees_locales" ADD CONSTRAINT "committees_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources" ADD CONSTRAINT "resources_standard_id_standards_id_fk" FOREIGN KEY ("standard_id") REFERENCES "public"."standards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "resources_locales" ADD CONSTRAINT "resources_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "effective_dates_sections_rows" ADD CONSTRAINT "effective_dates_sections_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."effective_dates_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "effective_dates_sections_rows_locales" ADD CONSTRAINT "effective_dates_sections_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."effective_dates_sections_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "effective_dates_sections" ADD CONSTRAINT "effective_dates_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."effective_dates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "effective_dates_sections_locales" ADD CONSTRAINT "effective_dates_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."effective_dates_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "effective_dates_footnotes" ADD CONSTRAINT "effective_dates_footnotes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."effective_dates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "effective_dates_footnotes_locales" ADD CONSTRAINT "effective_dates_footnotes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."effective_dates_footnotes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "effective_dates" ADD CONSTRAINT "effective_dates_standard_id_standards_id_fk" FOREIGN KEY ("standard_id") REFERENCES "public"."standards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "effective_dates_locales" ADD CONSTRAINT "effective_dates_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."effective_dates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "documents_for_comment" ADD CONSTRAINT "documents_for_comment_standard_id_standards_id_fk" FOREIGN KEY ("standard_id") REFERENCES "public"."standards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents_for_comment" ADD CONSTRAINT "documents_for_comment_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents_for_comment_locales" ADD CONSTRAINT "documents_for_comment_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."documents_for_comment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "document_details_comment_questions" ADD CONSTRAINT "document_details_comment_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."document_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "document_details_comment_questions_locales" ADD CONSTRAINT "document_details_comment_questions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."document_details_comment_questions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "document_details_support_materials" ADD CONSTRAINT "document_details_support_materials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."document_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "document_details_support_materials_locales" ADD CONSTRAINT "document_details_support_materials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."document_details_support_materials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "document_details" ADD CONSTRAINT "document_details_standard_id_standards_id_fk" FOREIGN KEY ("standard_id") REFERENCES "public"."standards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "document_details" ADD CONSTRAINT "document_details_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "document_details_locales" ADD CONSTRAINT "document_details_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."document_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "document_details_rels" ADD CONSTRAINT "document_details_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."document_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "document_details_rels" ADD CONSTRAINT "document_details_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "job_postings_locales" ADD CONSTRAINT "job_postings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."job_postings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "standards_sections_tabs" ADD CONSTRAINT "standards_sections_tabs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."standards_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "standards_sections_tabs_locales" ADD CONSTRAINT "standards_sections_tabs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."standards_sections_tabs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "standards_sections_feature_c_t_as" ADD CONSTRAINT "standards_sections_feature_c_t_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."standards_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "standards_sections_feature_c_t_as_locales" ADD CONSTRAINT "standards_sections_feature_c_t_as_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."standards_sections_feature_c_t_as"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "standards_sections" ADD CONSTRAINT "standards_sections_board_logo_id_media_id_fk" FOREIGN KEY ("board_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "standards_sections" ADD CONSTRAINT "standards_sections_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "standards_sections_locales" ADD CONSTRAINT "standards_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."standards_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "standards_sections_rels" ADD CONSTRAINT "standards_sections_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."standards_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "standards_sections_rels" ADD CONSTRAINT "standards_sections_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_boards_fk" FOREIGN KEY ("boards_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_standards_fk" FOREIGN KEY ("standards_id") REFERENCES "public"."standards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consultations_fk" FOREIGN KEY ("consultations_id") REFERENCES "public"."consultations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_decision_summaries_fk" FOREIGN KEY ("decision_summaries_id") REFERENCES "public"."decision_summaries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_contacts_fk" FOREIGN KEY ("contacts_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_board_members_fk" FOREIGN KEY ("board_members_id") REFERENCES "public"."board_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_committees_fk" FOREIGN KEY ("committees_id") REFERENCES "public"."committees"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_resources_fk" FOREIGN KEY ("resources_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_effective_dates_fk" FOREIGN KEY ("effective_dates_id") REFERENCES "public"."effective_dates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_for_comment_fk" FOREIGN KEY ("documents_for_comment_id") REFERENCES "public"."documents_for_comment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_document_details_fk" FOREIGN KEY ("document_details_id") REFERENCES "public"."document_details"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_job_postings_fk" FOREIGN KEY ("job_postings_id") REFERENCES "public"."job_postings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_standards_sections_fk" FOREIGN KEY ("standards_sections_id") REFERENCES "public"."standards_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_utility_links" ADD CONSTRAINT "navigation_utility_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_utility_links_locales" ADD CONSTRAINT "navigation_utility_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_utility_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_primary_nav" ADD CONSTRAINT "navigation_primary_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_primary_nav_locales" ADD CONSTRAINT "navigation_primary_nav_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_primary_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menu_columns_links" ADD CONSTRAINT "navigation_mega_menu_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menu_columns_links_locales" ADD CONSTRAINT "navigation_mega_menu_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menu_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menu_columns" ADD CONSTRAINT "navigation_mega_menu_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menu_columns_locales" ADD CONSTRAINT "navigation_mega_menu_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menu_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menu" ADD CONSTRAINT "navigation_mega_menu_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_mega_menu_locales" ADD CONSTRAINT "navigation_mega_menu_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_mega_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links" ADD CONSTRAINT "footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_links_locales" ADD CONSTRAINT "footer_columns_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns" ADD CONSTRAINT "footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_columns_locales" ADD CONSTRAINT "footer_columns_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_boards_links" ADD CONSTRAINT "footer_boards_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_boards_links_locales" ADD CONSTRAINT "footer_boards_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_boards_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_quick_links" ADD CONSTRAINT "footer_quick_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_quick_links_locales" ADD CONSTRAINT "footer_quick_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_quick_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_hero_links" ADD CONSTRAINT "homepage_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta_links" ADD CONSTRAINT "homepage_blocks_cta_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta" ADD CONSTRAINT "homepage_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_content_columns" ADD CONSTRAINT "homepage_blocks_content_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_content" ADD CONSTRAINT "homepage_blocks_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_rich_text" ADD CONSTRAINT "homepage_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_news_grid" ADD CONSTRAINT "homepage_blocks_news_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_browse_by_standard_categories_links" ADD CONSTRAINT "homepage_blocks_browse_by_standard_categories_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_browse_by_standard_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_browse_by_standard_categories" ADD CONSTRAINT "homepage_blocks_browse_by_standard_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_browse_by_standard"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_browse_by_standard" ADD CONSTRAINT "homepage_blocks_browse_by_standard_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_config_popular_tags" ADD CONSTRAINT "search_config_popular_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_config_popular_tags_locales" ADD CONSTRAINT "search_config_popular_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search_config_popular_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "auth_config_locales" ADD CONSTRAINT "auth_config_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."auth_config"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "boards_tabs_order_idx" ON "boards_tabs" USING btree ("_order");
  CREATE INDEX "boards_tabs_parent_id_idx" ON "boards_tabs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "boards_tabs_locales_locale_parent_id_unique" ON "boards_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "boards_quick_actions_order_idx" ON "boards_quick_actions" USING btree ("_order");
  CREATE INDEX "boards_quick_actions_parent_id_idx" ON "boards_quick_actions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "boards_quick_actions_locales_locale_parent_id_unique" ON "boards_quick_actions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "boards_resources_order_idx" ON "boards_resources" USING btree ("_order");
  CREATE INDEX "boards_resources_parent_id_idx" ON "boards_resources" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "boards_slug_idx" ON "boards" USING btree ("slug");
  CREATE INDEX "boards_updated_at_idx" ON "boards" USING btree ("updated_at");
  CREATE INDEX "boards_created_at_idx" ON "boards" USING btree ("created_at");
  CREATE UNIQUE INDEX "boards_locales_locale_parent_id_unique" ON "boards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "standards_parts_order_idx" ON "standards_parts" USING btree ("_order");
  CREATE INDEX "standards_parts_parent_id_idx" ON "standards_parts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "standards_parts_locales_locale_parent_id_unique" ON "standards_parts_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "standards_slug_idx" ON "standards" USING btree ("slug");
  CREATE INDEX "standards_board_idx" ON "standards" USING btree ("board_id");
  CREATE INDEX "standards_updated_at_idx" ON "standards" USING btree ("updated_at");
  CREATE INDEX "standards_created_at_idx" ON "standards" USING btree ("created_at");
  CREATE UNIQUE INDEX "standards_locales_locale_parent_id_unique" ON "standards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_badges_order_idx" ON "projects_badges" USING btree ("_order");
  CREATE INDEX "projects_badges_parent_id_idx" ON "projects_badges" USING btree ("_parent_id");
  CREATE INDEX "projects_timeline_stages_ctas_order_idx" ON "projects_timeline_stages_ctas" USING btree ("_order");
  CREATE INDEX "projects_timeline_stages_ctas_parent_id_idx" ON "projects_timeline_stages_ctas" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_timeline_stages_ctas_locales_locale_parent_id_uniqu" ON "projects_timeline_stages_ctas_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_timeline_stages_order_idx" ON "projects_timeline_stages" USING btree ("_order");
  CREATE INDEX "projects_timeline_stages_parent_id_idx" ON "projects_timeline_stages" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "projects_timeline_stages_locales_locale_parent_id_unique" ON "projects_timeline_stages_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_board_idx" ON "projects" USING btree ("board_id");
  CREATE INDEX "projects_standard_idx" ON "projects" USING btree ("standard_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_documents_id_idx" ON "projects_rels" USING btree ("documents_id");
  CREATE INDEX "projects_rels_contacts_id_idx" ON "projects_rels" USING btree ("contacts_id");
  CREATE INDEX "consultations_action_documents_order_idx" ON "consultations_action_documents" USING btree ("_order");
  CREATE INDEX "consultations_action_documents_parent_id_idx" ON "consultations_action_documents" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "consultations_action_documents_locales_locale_parent_id_uniq" ON "consultations_action_documents_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "consultations_slug_idx" ON "consultations" USING btree ("slug");
  CREATE INDEX "consultations_board_idx" ON "consultations" USING btree ("board_id");
  CREATE INDEX "consultations_standard_idx" ON "consultations" USING btree ("standard_id");
  CREATE INDEX "consultations_project_idx" ON "consultations" USING btree ("project_id");
  CREATE INDEX "consultations_updated_at_idx" ON "consultations" USING btree ("updated_at");
  CREATE INDEX "consultations_created_at_idx" ON "consultations" USING btree ("created_at");
  CREATE UNIQUE INDEX "consultations_locales_locale_parent_id_unique" ON "consultations_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_featured_image_idx" ON "news" USING btree ("featured_image_id");
  CREATE INDEX "news_board_idx" ON "news" USING btree ("board_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE UNIQUE INDEX "news_locales_locale_parent_id_unique" ON "news_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_board_idx" ON "events" USING btree ("board_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "documents_slug_idx" ON "documents" USING btree ("slug");
  CREATE INDEX "documents_file_idx" ON "documents" USING btree ("file_id");
  CREATE INDEX "documents_board_idx" ON "documents" USING btree ("board_id");
  CREATE INDEX "documents_standard_idx" ON "documents" USING btree ("standard_id");
  CREATE INDEX "documents_project_idx" ON "documents" USING btree ("project_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_locales_locale_parent_id_unique" ON "documents_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "decision_summaries_slug_idx" ON "decision_summaries" USING btree ("slug");
  CREATE INDEX "decision_summaries_board_idx" ON "decision_summaries" USING btree ("board_id");
  CREATE INDEX "decision_summaries_updated_at_idx" ON "decision_summaries" USING btree ("updated_at");
  CREATE INDEX "decision_summaries_created_at_idx" ON "decision_summaries" USING btree ("created_at");
  CREATE UNIQUE INDEX "decision_summaries_locales_locale_parent_id_unique" ON "decision_summaries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "contacts_photo_idx" ON "contacts" USING btree ("photo_id");
  CREATE INDEX "contacts_updated_at_idx" ON "contacts" USING btree ("updated_at");
  CREATE INDEX "contacts_created_at_idx" ON "contacts" USING btree ("created_at");
  CREATE UNIQUE INDEX "contacts_locales_locale_parent_id_unique" ON "contacts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_links_order_idx" ON "pages_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_links_parent_id_idx" ON "pages_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE INDEX "pages_blocks_content_columns_order_idx" ON "pages_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_columns_parent_id_idx" ON "pages_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_order_idx" ON "pages_blocks_content" USING btree ("_order");
  CREATE INDEX "pages_blocks_content_parent_id_idx" ON "pages_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_content_path_idx" ON "pages_blocks_content" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_news_grid_order_idx" ON "pages_blocks_news_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_news_grid_parent_id_idx" ON "pages_blocks_news_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_news_grid_path_idx" ON "pages_blocks_news_grid" USING btree ("_path");
  CREATE INDEX "pages_blocks_browse_by_standard_categories_links_order_idx" ON "pages_blocks_browse_by_standard_categories_links" USING btree ("_order");
  CREATE INDEX "pages_blocks_browse_by_standard_categories_links_parent_id_idx" ON "pages_blocks_browse_by_standard_categories_links" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_browse_by_standard_categories_order_idx" ON "pages_blocks_browse_by_standard_categories" USING btree ("_order");
  CREATE INDEX "pages_blocks_browse_by_standard_categories_parent_id_idx" ON "pages_blocks_browse_by_standard_categories" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_browse_by_standard_order_idx" ON "pages_blocks_browse_by_standard" USING btree ("_order");
  CREATE INDEX "pages_blocks_browse_by_standard_parent_id_idx" ON "pages_blocks_browse_by_standard" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_browse_by_standard_path_idx" ON "pages_blocks_browse_by_standard" USING btree ("_path");
  CREATE INDEX "pages_section_nav_links_order_idx" ON "pages_section_nav_links" USING btree ("_order");
  CREATE INDEX "pages_section_nav_links_parent_id_idx" ON "pages_section_nav_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_section_nav_links_locales_locale_parent_id_unique" ON "pages_section_nav_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_board_idx" ON "pages" USING btree ("board_id");
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE INDEX "pages_meta_meta_og_image_idx" ON "pages" USING btree ("meta_og_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_pages_id_idx" ON "pages_rels" USING btree ("pages_id");
  CREATE INDEX "pages_rels_news_id_idx" ON "pages_rels" USING btree ("news_id");
  CREATE INDEX "pages_rels_contacts_id_idx" ON "pages_rels" USING btree ("contacts_id");
  CREATE INDEX "board_members_photo_idx" ON "board_members" USING btree ("photo_id");
  CREATE INDEX "board_members_bio_page_idx" ON "board_members" USING btree ("bio_page_id");
  CREATE INDEX "board_members_board_idx" ON "board_members" USING btree ("board_id");
  CREATE INDEX "board_members_updated_at_idx" ON "board_members" USING btree ("updated_at");
  CREATE INDEX "board_members_created_at_idx" ON "board_members" USING btree ("created_at");
  CREATE UNIQUE INDEX "board_members_locales_locale_parent_id_unique" ON "board_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "committees_members_order_idx" ON "committees_members" USING btree ("_order");
  CREATE INDEX "committees_members_parent_id_idx" ON "committees_members" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "committees_members_locales_locale_parent_id_unique" ON "committees_members_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "committees_meeting_reports_order_idx" ON "committees_meeting_reports" USING btree ("_order");
  CREATE INDEX "committees_meeting_reports_parent_id_idx" ON "committees_meeting_reports" USING btree ("_parent_id");
  CREATE INDEX "committees_meeting_reports_file_idx" ON "committees_meeting_reports" USING btree ("file_id");
  CREATE UNIQUE INDEX "committees_meeting_reports_locales_locale_parent_id_unique" ON "committees_meeting_reports_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "committees_slug_idx" ON "committees" USING btree ("slug");
  CREATE INDEX "committees_board_idx" ON "committees" USING btree ("board_id");
  CREATE INDEX "committees_updated_at_idx" ON "committees" USING btree ("updated_at");
  CREATE INDEX "committees_created_at_idx" ON "committees" USING btree ("created_at");
  CREATE UNIQUE INDEX "committees_locales_locale_parent_id_unique" ON "committees_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "resources_slug_idx" ON "resources" USING btree ("slug");
  CREATE INDEX "resources_file_idx" ON "resources" USING btree ("file_id");
  CREATE INDEX "resources_board_idx" ON "resources" USING btree ("board_id");
  CREATE INDEX "resources_standard_idx" ON "resources" USING btree ("standard_id");
  CREATE INDEX "resources_updated_at_idx" ON "resources" USING btree ("updated_at");
  CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");
  CREATE UNIQUE INDEX "resources_locales_locale_parent_id_unique" ON "resources_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "effective_dates_sections_rows_order_idx" ON "effective_dates_sections_rows" USING btree ("_order");
  CREATE INDEX "effective_dates_sections_rows_parent_id_idx" ON "effective_dates_sections_rows" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "effective_dates_sections_rows_locales_locale_parent_id_uniqu" ON "effective_dates_sections_rows_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "effective_dates_sections_order_idx" ON "effective_dates_sections" USING btree ("_order");
  CREATE INDEX "effective_dates_sections_parent_id_idx" ON "effective_dates_sections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "effective_dates_sections_locales_locale_parent_id_unique" ON "effective_dates_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "effective_dates_footnotes_order_idx" ON "effective_dates_footnotes" USING btree ("_order");
  CREATE INDEX "effective_dates_footnotes_parent_id_idx" ON "effective_dates_footnotes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "effective_dates_footnotes_locales_locale_parent_id_unique" ON "effective_dates_footnotes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "effective_dates_standard_idx" ON "effective_dates" USING btree ("standard_id");
  CREATE INDEX "effective_dates_updated_at_idx" ON "effective_dates" USING btree ("updated_at");
  CREATE INDEX "effective_dates_created_at_idx" ON "effective_dates" USING btree ("created_at");
  CREATE UNIQUE INDEX "effective_dates_locales_locale_parent_id_unique" ON "effective_dates_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "documents_for_comment_slug_idx" ON "documents_for_comment" USING btree ("slug");
  CREATE INDEX "documents_for_comment_standard_idx" ON "documents_for_comment" USING btree ("standard_id");
  CREATE INDEX "documents_for_comment_board_idx" ON "documents_for_comment" USING btree ("board_id");
  CREATE INDEX "documents_for_comment_updated_at_idx" ON "documents_for_comment" USING btree ("updated_at");
  CREATE INDEX "documents_for_comment_created_at_idx" ON "documents_for_comment" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_for_comment_locales_locale_parent_id_unique" ON "documents_for_comment_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "document_details_comment_questions_order_idx" ON "document_details_comment_questions" USING btree ("_order");
  CREATE INDEX "document_details_comment_questions_parent_id_idx" ON "document_details_comment_questions" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "document_details_comment_questions_locales_locale_parent_id_" ON "document_details_comment_questions_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "document_details_support_materials_order_idx" ON "document_details_support_materials" USING btree ("_order");
  CREATE INDEX "document_details_support_materials_parent_id_idx" ON "document_details_support_materials" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "document_details_support_materials_locales_locale_parent_id_" ON "document_details_support_materials_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "document_details_slug_idx" ON "document_details" USING btree ("slug");
  CREATE INDEX "document_details_standard_idx" ON "document_details" USING btree ("standard_id");
  CREATE INDEX "document_details_board_idx" ON "document_details" USING btree ("board_id");
  CREATE INDEX "document_details_updated_at_idx" ON "document_details" USING btree ("updated_at");
  CREATE INDEX "document_details_created_at_idx" ON "document_details" USING btree ("created_at");
  CREATE UNIQUE INDEX "document_details_locales_locale_parent_id_unique" ON "document_details_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "document_details_rels_order_idx" ON "document_details_rels" USING btree ("order");
  CREATE INDEX "document_details_rels_parent_idx" ON "document_details_rels" USING btree ("parent_id");
  CREATE INDEX "document_details_rels_path_idx" ON "document_details_rels" USING btree ("path");
  CREATE INDEX "document_details_rels_contacts_id_idx" ON "document_details_rels" USING btree ("contacts_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "job_postings_updated_at_idx" ON "job_postings" USING btree ("updated_at");
  CREATE INDEX "job_postings_created_at_idx" ON "job_postings" USING btree ("created_at");
  CREATE UNIQUE INDEX "job_postings_locales_locale_parent_id_unique" ON "job_postings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "standards_sections_tabs_order_idx" ON "standards_sections_tabs" USING btree ("_order");
  CREATE INDEX "standards_sections_tabs_parent_id_idx" ON "standards_sections_tabs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "standards_sections_tabs_locales_locale_parent_id_unique" ON "standards_sections_tabs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "standards_sections_feature_c_t_as_order_idx" ON "standards_sections_feature_c_t_as" USING btree ("_order");
  CREATE INDEX "standards_sections_feature_c_t_as_parent_id_idx" ON "standards_sections_feature_c_t_as" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "standards_sections_feature_c_t_as_locales_locale_parent_id_u" ON "standards_sections_feature_c_t_as_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "standards_sections_slug_idx" ON "standards_sections" USING btree ("slug");
  CREATE INDEX "standards_sections_board_logo_idx" ON "standards_sections" USING btree ("board_logo_id");
  CREATE INDEX "standards_sections_board_idx" ON "standards_sections" USING btree ("board_id");
  CREATE INDEX "standards_sections_updated_at_idx" ON "standards_sections" USING btree ("updated_at");
  CREATE INDEX "standards_sections_created_at_idx" ON "standards_sections" USING btree ("created_at");
  CREATE UNIQUE INDEX "standards_sections_locales_locale_parent_id_unique" ON "standards_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "standards_sections_rels_order_idx" ON "standards_sections_rels" USING btree ("order");
  CREATE INDEX "standards_sections_rels_parent_idx" ON "standards_sections_rels" USING btree ("parent_id");
  CREATE INDEX "standards_sections_rels_path_idx" ON "standards_sections_rels" USING btree ("path");
  CREATE INDEX "standards_sections_rels_projects_id_idx" ON "standards_sections_rels" USING btree ("projects_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_boards_id_idx" ON "payload_locked_documents_rels" USING btree ("boards_id");
  CREATE INDEX "payload_locked_documents_rels_standards_id_idx" ON "payload_locked_documents_rels" USING btree ("standards_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_consultations_id_idx" ON "payload_locked_documents_rels" USING btree ("consultations_id");
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_decision_summaries_id_idx" ON "payload_locked_documents_rels" USING btree ("decision_summaries_id");
  CREATE INDEX "payload_locked_documents_rels_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("contacts_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_board_members_id_idx" ON "payload_locked_documents_rels" USING btree ("board_members_id");
  CREATE INDEX "payload_locked_documents_rels_committees_id_idx" ON "payload_locked_documents_rels" USING btree ("committees_id");
  CREATE INDEX "payload_locked_documents_rels_resources_id_idx" ON "payload_locked_documents_rels" USING btree ("resources_id");
  CREATE INDEX "payload_locked_documents_rels_effective_dates_id_idx" ON "payload_locked_documents_rels" USING btree ("effective_dates_id");
  CREATE INDEX "payload_locked_documents_rels_documents_for_comment_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_for_comment_id");
  CREATE INDEX "payload_locked_documents_rels_document_details_id_idx" ON "payload_locked_documents_rels" USING btree ("document_details_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_job_postings_id_idx" ON "payload_locked_documents_rels" USING btree ("job_postings_id");
  CREATE INDEX "payload_locked_documents_rels_standards_sections_id_idx" ON "payload_locked_documents_rels" USING btree ("standards_sections_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "navigation_utility_links_order_idx" ON "navigation_utility_links" USING btree ("_order");
  CREATE INDEX "navigation_utility_links_parent_id_idx" ON "navigation_utility_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_utility_links_locales_locale_parent_id_unique" ON "navigation_utility_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_primary_nav_order_idx" ON "navigation_primary_nav" USING btree ("_order");
  CREATE INDEX "navigation_primary_nav_parent_id_idx" ON "navigation_primary_nav" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_primary_nav_locales_locale_parent_id_unique" ON "navigation_primary_nav_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_mega_menu_columns_links_order_idx" ON "navigation_mega_menu_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_mega_menu_columns_links_parent_id_idx" ON "navigation_mega_menu_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_mega_menu_columns_links_locales_locale_parent_id_" ON "navigation_mega_menu_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_mega_menu_columns_order_idx" ON "navigation_mega_menu_columns" USING btree ("_order");
  CREATE INDEX "navigation_mega_menu_columns_parent_id_idx" ON "navigation_mega_menu_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_mega_menu_columns_locales_locale_parent_id_unique" ON "navigation_mega_menu_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_mega_menu_order_idx" ON "navigation_mega_menu" USING btree ("_order");
  CREATE INDEX "navigation_mega_menu_parent_id_idx" ON "navigation_mega_menu" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_mega_menu_locales_locale_parent_id_unique" ON "navigation_mega_menu_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_links_order_idx" ON "footer_columns_links" USING btree ("_order");
  CREATE INDEX "footer_columns_links_parent_id_idx" ON "footer_columns_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_links_locales_locale_parent_id_unique" ON "footer_columns_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_columns_order_idx" ON "footer_columns" USING btree ("_order");
  CREATE INDEX "footer_columns_parent_id_idx" ON "footer_columns" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_columns_locales_locale_parent_id_unique" ON "footer_columns_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_boards_links_order_idx" ON "footer_boards_links" USING btree ("_order");
  CREATE INDEX "footer_boards_links_parent_id_idx" ON "footer_boards_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_boards_links_locales_locale_parent_id_unique" ON "footer_boards_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "footer_quick_links_order_idx" ON "footer_quick_links" USING btree ("_order");
  CREATE INDEX "footer_quick_links_parent_id_idx" ON "footer_quick_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "footer_quick_links_locales_locale_parent_id_unique" ON "footer_quick_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_hero_links_order_idx" ON "homepage_hero_links" USING btree ("_order");
  CREATE INDEX "homepage_hero_links_parent_id_idx" ON "homepage_hero_links" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_links_order_idx" ON "homepage_blocks_cta_links" USING btree ("_order");
  CREATE INDEX "homepage_blocks_cta_links_parent_id_idx" ON "homepage_blocks_cta_links" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_order_idx" ON "homepage_blocks_cta" USING btree ("_order");
  CREATE INDEX "homepage_blocks_cta_parent_id_idx" ON "homepage_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_path_idx" ON "homepage_blocks_cta" USING btree ("_path");
  CREATE INDEX "homepage_blocks_content_columns_order_idx" ON "homepage_blocks_content_columns" USING btree ("_order");
  CREATE INDEX "homepage_blocks_content_columns_parent_id_idx" ON "homepage_blocks_content_columns" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_content_order_idx" ON "homepage_blocks_content" USING btree ("_order");
  CREATE INDEX "homepage_blocks_content_parent_id_idx" ON "homepage_blocks_content" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_content_path_idx" ON "homepage_blocks_content" USING btree ("_path");
  CREATE INDEX "homepage_blocks_rich_text_order_idx" ON "homepage_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "homepage_blocks_rich_text_parent_id_idx" ON "homepage_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_rich_text_path_idx" ON "homepage_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "homepage_blocks_news_grid_order_idx" ON "homepage_blocks_news_grid" USING btree ("_order");
  CREATE INDEX "homepage_blocks_news_grid_parent_id_idx" ON "homepage_blocks_news_grid" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_news_grid_path_idx" ON "homepage_blocks_news_grid" USING btree ("_path");
  CREATE INDEX "homepage_blocks_browse_by_standard_categories_links_order_idx" ON "homepage_blocks_browse_by_standard_categories_links" USING btree ("_order");
  CREATE INDEX "homepage_blocks_browse_by_standard_categories_links_parent_id_idx" ON "homepage_blocks_browse_by_standard_categories_links" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_browse_by_standard_categories_order_idx" ON "homepage_blocks_browse_by_standard_categories" USING btree ("_order");
  CREATE INDEX "homepage_blocks_browse_by_standard_categories_parent_id_idx" ON "homepage_blocks_browse_by_standard_categories" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_browse_by_standard_order_idx" ON "homepage_blocks_browse_by_standard" USING btree ("_order");
  CREATE INDEX "homepage_blocks_browse_by_standard_parent_id_idx" ON "homepage_blocks_browse_by_standard" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_browse_by_standard_path_idx" ON "homepage_blocks_browse_by_standard" USING btree ("_path");
  CREATE INDEX "homepage_hero_hero_media_idx" ON "homepage" USING btree ("hero_media_id");
  CREATE INDEX "homepage_rels_order_idx" ON "homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_pages_id_idx" ON "homepage_rels" USING btree ("pages_id");
  CREATE INDEX "homepage_rels_news_id_idx" ON "homepage_rels" USING btree ("news_id");
  CREATE INDEX "search_config_popular_tags_order_idx" ON "search_config_popular_tags" USING btree ("_order");
  CREATE INDEX "search_config_popular_tags_parent_id_idx" ON "search_config_popular_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "search_config_popular_tags_locales_locale_parent_id_unique" ON "search_config_popular_tags_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "auth_config_locales_locale_parent_id_unique" ON "auth_config_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "boards_tabs" CASCADE;
  DROP TABLE "boards_tabs_locales" CASCADE;
  DROP TABLE "boards_quick_actions" CASCADE;
  DROP TABLE "boards_quick_actions_locales" CASCADE;
  DROP TABLE "boards_resources" CASCADE;
  DROP TABLE "boards" CASCADE;
  DROP TABLE "boards_locales" CASCADE;
  DROP TABLE "standards_parts" CASCADE;
  DROP TABLE "standards_parts_locales" CASCADE;
  DROP TABLE "standards" CASCADE;
  DROP TABLE "standards_locales" CASCADE;
  DROP TABLE "projects_badges" CASCADE;
  DROP TABLE "projects_timeline_stages_ctas" CASCADE;
  DROP TABLE "projects_timeline_stages_ctas_locales" CASCADE;
  DROP TABLE "projects_timeline_stages" CASCADE;
  DROP TABLE "projects_timeline_stages_locales" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "consultations_action_documents" CASCADE;
  DROP TABLE "consultations_action_documents_locales" CASCADE;
  DROP TABLE "consultations" CASCADE;
  DROP TABLE "consultations_locales" CASCADE;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_locales" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "documents_locales" CASCADE;
  DROP TABLE "decision_summaries" CASCADE;
  DROP TABLE "decision_summaries_locales" CASCADE;
  DROP TABLE "contacts" CASCADE;
  DROP TABLE "contacts_locales" CASCADE;
  DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "pages_blocks_cta_links" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages_blocks_content_columns" CASCADE;
  DROP TABLE "pages_blocks_content" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_news_grid" CASCADE;
  DROP TABLE "pages_blocks_browse_by_standard_categories_links" CASCADE;
  DROP TABLE "pages_blocks_browse_by_standard_categories" CASCADE;
  DROP TABLE "pages_blocks_browse_by_standard" CASCADE;
  DROP TABLE "pages_section_nav_links" CASCADE;
  DROP TABLE "pages_section_nav_links_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "board_members" CASCADE;
  DROP TABLE "board_members_locales" CASCADE;
  DROP TABLE "committees_members" CASCADE;
  DROP TABLE "committees_members_locales" CASCADE;
  DROP TABLE "committees_meeting_reports" CASCADE;
  DROP TABLE "committees_meeting_reports_locales" CASCADE;
  DROP TABLE "committees" CASCADE;
  DROP TABLE "committees_locales" CASCADE;
  DROP TABLE "resources" CASCADE;
  DROP TABLE "resources_locales" CASCADE;
  DROP TABLE "effective_dates_sections_rows" CASCADE;
  DROP TABLE "effective_dates_sections_rows_locales" CASCADE;
  DROP TABLE "effective_dates_sections" CASCADE;
  DROP TABLE "effective_dates_sections_locales" CASCADE;
  DROP TABLE "effective_dates_footnotes" CASCADE;
  DROP TABLE "effective_dates_footnotes_locales" CASCADE;
  DROP TABLE "effective_dates" CASCADE;
  DROP TABLE "effective_dates_locales" CASCADE;
  DROP TABLE "documents_for_comment" CASCADE;
  DROP TABLE "documents_for_comment_locales" CASCADE;
  DROP TABLE "document_details_comment_questions" CASCADE;
  DROP TABLE "document_details_comment_questions_locales" CASCADE;
  DROP TABLE "document_details_support_materials" CASCADE;
  DROP TABLE "document_details_support_materials_locales" CASCADE;
  DROP TABLE "document_details" CASCADE;
  DROP TABLE "document_details_locales" CASCADE;
  DROP TABLE "document_details_rels" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "job_postings" CASCADE;
  DROP TABLE "job_postings_locales" CASCADE;
  DROP TABLE "standards_sections_tabs" CASCADE;
  DROP TABLE "standards_sections_tabs_locales" CASCADE;
  DROP TABLE "standards_sections_feature_c_t_as" CASCADE;
  DROP TABLE "standards_sections_feature_c_t_as_locales" CASCADE;
  DROP TABLE "standards_sections" CASCADE;
  DROP TABLE "standards_sections_locales" CASCADE;
  DROP TABLE "standards_sections_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "navigation_utility_links" CASCADE;
  DROP TABLE "navigation_utility_links_locales" CASCADE;
  DROP TABLE "navigation_primary_nav" CASCADE;
  DROP TABLE "navigation_primary_nav_locales" CASCADE;
  DROP TABLE "navigation_mega_menu_columns_links" CASCADE;
  DROP TABLE "navigation_mega_menu_columns_links_locales" CASCADE;
  DROP TABLE "navigation_mega_menu_columns" CASCADE;
  DROP TABLE "navigation_mega_menu_columns_locales" CASCADE;
  DROP TABLE "navigation_mega_menu" CASCADE;
  DROP TABLE "navigation_mega_menu_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "footer_columns_links" CASCADE;
  DROP TABLE "footer_columns_links_locales" CASCADE;
  DROP TABLE "footer_columns" CASCADE;
  DROP TABLE "footer_columns_locales" CASCADE;
  DROP TABLE "footer_boards_links" CASCADE;
  DROP TABLE "footer_boards_links_locales" CASCADE;
  DROP TABLE "footer_quick_links" CASCADE;
  DROP TABLE "footer_quick_links_locales" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TABLE "homepage_hero_links" CASCADE;
  DROP TABLE "homepage_blocks_cta_links" CASCADE;
  DROP TABLE "homepage_blocks_cta" CASCADE;
  DROP TABLE "homepage_blocks_content_columns" CASCADE;
  DROP TABLE "homepage_blocks_content" CASCADE;
  DROP TABLE "homepage_blocks_rich_text" CASCADE;
  DROP TABLE "homepage_blocks_news_grid" CASCADE;
  DROP TABLE "homepage_blocks_browse_by_standard_categories_links" CASCADE;
  DROP TABLE "homepage_blocks_browse_by_standard_categories" CASCADE;
  DROP TABLE "homepage_blocks_browse_by_standard" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_rels" CASCADE;
  DROP TABLE "search_config_popular_tags" CASCADE;
  DROP TABLE "search_config_popular_tags_locales" CASCADE;
  DROP TABLE "search_config" CASCADE;
  DROP TABLE "auth_config" CASCADE;
  DROP TABLE "auth_config_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_boards_resources_type";
  DROP TYPE "public"."enum_standards_category";
  DROP TYPE "public"."enum_projects_badges_badge_type";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_projects_type";
  DROP TYPE "public"."enum_consultations_action_documents_type";
  DROP TYPE "public"."enum_consultations_type";
  DROP TYPE "public"."enum_news_category";
  DROP TYPE "public"."enum_events_type";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum_documents_type";
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_pages_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_pages_blocks_cta_variant";
  DROP TYPE "public"."enum_pages_blocks_content_columns_size";
  DROP TYPE "public"."enum_pages_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_pages_blocks_news_grid_populate_by";
  DROP TYPE "public"."enum_pages_sidebar_type";
  DROP TYPE "public"."enum_pages_page_layout";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum_pages_cta_block_variant";
  DROP TYPE "public"."enum_board_members_role";
  DROP TYPE "public"."enum_committees_status";
  DROP TYPE "public"."enum_resources_category";
  DROP TYPE "public"."enum_resources_resource_type";
  DROP TYPE "public"."enum_resources_status";
  DROP TYPE "public"."enum_documents_for_comment_group";
  DROP TYPE "public"."enum_documents_for_comment_status";
  DROP TYPE "public"."enum_document_details_support_materials_file_type";
  DROP TYPE "public"."enum_form_submissions_status";
  DROP TYPE "public"."enum_job_postings_status";
  DROP TYPE "public"."enum_standards_sections_feature_c_t_as_variant";
  DROP TYPE "public"."enum_homepage_hero_links_link_type";
  DROP TYPE "public"."enum_homepage_hero_links_link_appearance";
  DROP TYPE "public"."enum_homepage_blocks_cta_links_link_type";
  DROP TYPE "public"."enum_homepage_blocks_cta_links_link_appearance";
  DROP TYPE "public"."enum_homepage_blocks_cta_variant";
  DROP TYPE "public"."enum_homepage_blocks_content_columns_size";
  DROP TYPE "public"."enum_homepage_blocks_content_columns_link_type";
  DROP TYPE "public"."enum_homepage_blocks_news_grid_populate_by";
  DROP TYPE "public"."enum_homepage_hero_type";`)
}
