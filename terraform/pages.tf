resource "cloudflare_pages_project" "renfoc_us" {
  account_id        = var.cloudflare_account_id
  name              = "renfoc-us"
  production_branch = "main"
  build_config = {
    build_command       = "npx next build"
    destination_dir     = "out"
    root_dir            = ""
    web_analytics_tag   = "89860e8edee6400a906f3cf5c37a4437"
    web_analytics_token = "4559a9238d034cd8a032593b08b33d46"
  }
  deployment_configs = {
    preview = {
      always_use_latest_compatibility_date = false
      build_image_major_version            = 2
      compatibility_date                   = "2025-04-19"
      compatibility_flags                  = []
      env_vars                             = null
      fail_open                            = true
    }
    production = {
      always_use_latest_compatibility_date = false
      build_image_major_version            = 2
      compatibility_date                   = "2025-04-19"
      compatibility_flags                  = []
      env_vars                             = {}
      fail_open                            = true
      kv_namespaces = {
        user-scores = {
          namespace_id = cloudflare_workers_kv_namespace.rate_limiting.id
        }
      }
    }
  }
  source = {
    config = {
      owner                          = "rtrigoso"
      owner_id                       = "2831305"
      path_excludes                  = []
      path_includes                  = ["*"]
      pr_comments_enabled            = true
      preview_branch_excludes        = []
      preview_branch_includes        = ["*"]
      preview_deployment_setting     = "all"
      production_branch              = "main"
      production_deployments_enabled = true
      repo_id                        = "942960636"
      repo_name                      = "renfoc.us"
    }
    type = "github"
  }
}
