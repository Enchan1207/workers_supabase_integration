terraform {
  backend "s3" {
    bucket = "terraform-remote-state"
    key    = "worker_static_assets/terraform-stg.tfstate"
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

variable "cloudflare_account_id" {
  type = string
}

variable "app_origin" {
  type    = string
  default = "https://stg-worker-static-assets.enchan.me"
}

module "cloudflare_workers" {
  source                = "../../modules/cloudflare_workers"
  cloudflare_account_id = var.cloudflare_account_id
  worker_name           = "worker-static-assets-stg"
}

module "auth0" {
  source                    = "../../modules/auth0"
  auth0_callback            = var.app_origin
  auth0_app_name            = "worker-static-assets-stg"
  auth0_resource_identifier = var.app_origin
  auth0_logout_url          = var.app_origin
  auth0_web_origin          = var.app_origin
}

output "VITE_AUTH0_CLIENT_ID" {
  value = module.auth0.auth0_app_client_id
}
