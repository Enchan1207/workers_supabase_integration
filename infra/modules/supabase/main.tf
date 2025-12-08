terraform {
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

variable "supabase_access_token" {
  type      = string
  sensitive = true
}

variable "supabase_organization_id" {
  type = string
}

variable "supabase_project_name" {
  type = string
}

variable "supabase_database_password" {
  type = string
}

variable "supabase_region" {
  type    = string
  default = "ap-northeast-1"
}

provider "supabase" {
  access_token = var.supabase_access_token
}

resource "supabase_project" "database" {
  organization_id   = var.supabase_organization_id
  name              = var.supabase_project_name
  database_password = var.supabase_database_password
  region            = var.supabase_region

  lifecycle {
    ignore_changes = [
      database_password,
      instance_size,
    ]
  }
}

output "supabase_database_id" {
  value = supabase_project.database.id
}
