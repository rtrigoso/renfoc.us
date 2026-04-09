resource "cloudflare_zone" "kndly_app" {
  name                = "kndly.app"
  paused              = false
  type                = "full"
  vanity_name_servers = []
  account = {
    id   = var.cloudflare_account_id
    name = "Renzotrigoso@gmail.com's Account"
  }
}

resource "cloudflare_zone" "ren_codes" {
  name                = "ren.codes"
  paused              = false
  type                = "full"
  vanity_name_servers = []
  account = {
    id   = var.cloudflare_account_id
    name = "Renzotrigoso@gmail.com's Account"
  }
}

resource "cloudflare_zone" "renfoc_us" {
  name                = "renfoc.us"
  paused              = false
  type                = "full"
  vanity_name_servers = []
  account = {
    id   = var.cloudflare_account_id
    name = "Renzotrigoso@gmail.com's Account"
  }
}

resource "cloudflare_zone" "ren_rocks" {
  name                = "ren.rocks"
  paused              = false
  type                = "full"
  vanity_name_servers = []
  account = {
    id   = var.cloudflare_account_id
    name = "Renzotrigoso@gmail.com's Account"
  }
}
