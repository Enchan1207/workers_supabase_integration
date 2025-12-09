variable "env" {
  type = string
}

variable "database_url" {
  type = string
}

locals {
  local_env = templatefile("${path.module}/.env.environment.tftpl",
    {
      database_url = var.database_url
    }
  )
}

resource "local_file" "env_local" {
  filename = "${path.root}/../../../packages/app/.env.${var.env}.local"
  content  = local.local_env
}
