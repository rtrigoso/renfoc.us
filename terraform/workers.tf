resource "cloudflare_workers_kv_namespace" "rate_limiting" {
  account_id = var.cloudflare_account_id
  title      = "RATE_LIMITING"
}
