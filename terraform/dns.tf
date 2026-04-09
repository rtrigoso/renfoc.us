resource "cloudflare_dns_record" "hn_renfoc_us_a" {
  content  = "34.120.54.55"
  name     = "hn.renfoc.us"
  proxied  = true
  tags     = []
  ttl      = 1
  type     = "A"
  zone_id  = cloudflare_zone.renfoc_us.id
  settings = {}
}

resource "cloudflare_dns_record" "hn_renfoc_us_aaaa" {
  content  = "2600:1901:0:6d85::"
  name     = "hn.renfoc.us"
  proxied  = true
  tags     = []
  ttl      = 1
  type     = "AAAA"
  zone_id  = cloudflare_zone.renfoc_us.id
  settings = {}
}

resource "cloudflare_dns_record" "acme_challenge_hn" {
  content = "84969bfedfa8e094fe1fb0e7._acme.deno.dev"
  name    = "_acme-challenge.hn.renfoc.us"
  proxied = false
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = cloudflare_zone.renfoc_us.id
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "books_renfoc_us" {
  content = "56f60cdd-ba56-4ffc-bffd-66b393e0ec13.cfargotunnel.com"
  name    = "books.renfoc.us"
  proxied = true
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = cloudflare_zone.renfoc_us.id
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "code_renfoc_us" {
  content = "56f60cdd-ba56-4ffc-bffd-66b393e0ec13.cfargotunnel.com"
  name    = "code.renfoc.us"
  proxied = true
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = cloudflare_zone.renfoc_us.id
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "miniflux_renfoc_us" {
  content = "6a20d17b-ce6f-4164-bc06-31dc85bec5e2.cfargotunnel.com"
  name    = "miniflux.renfoc.us"
  proxied = true
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = cloudflare_zone.renfoc_us.id
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "ntfy_renfoc_us" {
  content = "6a20d17b-ce6f-4164-bc06-31dc85bec5e2.cfargotunnel.com"
  name    = "ntfy.renfoc.us"
  proxied = true
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = cloudflare_zone.renfoc_us.id
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "renfoc_us_root" {
  content = "renfoc-us.pages.dev"
  name    = "renfoc.us"
  proxied = true
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = cloudflare_zone.renfoc_us.id
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "storage_renfoc_us" {
  content = "6a20d17b-ce6f-4164-bc06-31dc85bec5e2.cfargotunnel.com"
  name    = "storage.renfoc.us"
  proxied = true
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = cloudflare_zone.renfoc_us.id
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "to_renfoc_us" {
  content = "6a20d17b-ce6f-4164-bc06-31dc85bec5e2.cfargotunnel.com"
  name    = "to.renfoc.us"
  proxied = true
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = cloudflare_zone.renfoc_us.id
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "watchlist_renfoc_us" {
  content = "56f60cdd-ba56-4ffc-bffd-66b393e0ec13.cfargotunnel.com"
  name    = "watchlist.renfoc.us"
  proxied = true
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = cloudflare_zone.renfoc_us.id
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "www_renfoc_us" {
  content = "renfoc.us"
  name    = "www.renfoc.us"
  proxied = true
  tags    = []
  ttl     = 1
  type    = "CNAME"
  zone_id = cloudflare_zone.renfoc_us.id
  settings = {
    flatten_cname = false
  }
}

resource "cloudflare_dns_record" "github_pages_challenge" {
  content  = "\"bf62903fa6ca6023014da89f8b0ad0\""
  name     = "_github-pages-challenge-rtrigoso.renfoc.us"
  proxied  = false
  tags     = []
  ttl      = 1
  type     = "TXT"
  zone_id  = cloudflare_zone.renfoc_us.id
  settings = {}
}
