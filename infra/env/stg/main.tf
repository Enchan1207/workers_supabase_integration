terraform {
  backend "s3" {
    bucket = "terraform-remote-state"
    key    = "workers_supabase_integration/terraform-stg.tfstate"
    region = "auto"

    // R2のための設定
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
    use_path_style              = true
  }
}

// Will be injected via ENV vars
variable "cloudflare_account_id" {
  type = string
}

variable "supabase_access_token" {
  type      = string
  sensitive = true
}

variable "supabase_organization_id" {
  type = string
}

variable "supabase_database_password" {
  type = string
}

variable "app_origin" {
  type    = string
  default = "https://stg-workers-supabase-integration.enchan.me"
}

module "cloudflare_workers" {
  source                = "../../modules/cloudflare_workers"
  cloudflare_account_id = var.cloudflare_account_id
  worker_name           = "workers-supabase-integration-stg"
}

module "auth0" {
  source                    = "../../modules/auth0"
  auth0_callback            = var.app_origin
  auth0_app_name            = "workers-supabase-integration-stg"
  auth0_resource_identifier = var.app_origin
  auth0_logout_url          = var.app_origin
  auth0_web_origin          = var.app_origin
}

module "supabase" {
  source                     = "../../modules/supabase"
  supabase_access_token      = var.supabase_access_token
  supabase_organization_id   = var.supabase_organization_id
  supabase_project_name      = "workers-supabase-integration-stg"
  supabase_database_password = var.supabase_database_password
}

module "worker_secret" {
  source       = "../../modules/worker_secret"
  database_url = "postgresql://postgres.${module.supabase.supabase_database_id}:${var.supabase_database_password}@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres"
  env          = "staging"
}

output "VITE_AUTH0_CLIENT_ID" {
  value = module.auth0.auth0_app_client_id
}
