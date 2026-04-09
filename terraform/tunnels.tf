resource "cloudflare_zero_trust_tunnel_cloudflared" "portainer_arm" {
  account_id = var.cloudflare_account_id
  config_src = "cloudflare"
  name       = "portainer-arm"
}

resource "cloudflare_zero_trust_tunnel_cloudflared" "portainer_x64" {
  account_id = var.cloudflare_account_id
  config_src = "cloudflare"
  name       = "portainer-x64"
}

resource "cloudflare_zero_trust_tunnel_cloudflared" "unraid" {
  account_id = var.cloudflare_account_id
  config_src = "cloudflare"
  name       = "unraid"
}
