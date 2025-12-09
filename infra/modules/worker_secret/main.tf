variable "env" {
  type = string
}

variable "database_url" {
  type = string
}

locals {
  local_env = templatefile("${path.module}/.dev.vars.tftpl",
    {
      database_url = var.database_url
    }
  )
}

resource "local_file" "env_local" {
  filename = "${path.root}/../../../packages/app/.dev.vars.${var.env}"
  content  = local.local_env
}
