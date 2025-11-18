##### 11-18-2025
# Starting a Supabase Project

I want to build a new version of my HN aggregator (a tool that collects and organizes Hacker News posts) with a lot more features, so I did a bit of research. After a few minutes, I decided on [Supabase](https://supabase.com/) to handle the backend. Supabase has a nice pricing plan that simply stops you from creating a new project if you are exceeding your account tier level; Supabase has a free tier. For a personal project like this one, where I am mostly testing new things, not having overdraft fees on serverless is ideal. We do not want to end up like others who have faced surprise AWS Lambda bills in the thousands. It took a few minutes to get my project all setup - [Terraform](https://www.terraform.io/), Supabase CLI, and some other requirements took a little reading to decipher.

This post is meant for those who would like a little help with their Supabase project setup.

## Infrastructure as Code

Just like keeping the receipt of your expensive purchases, it is important to keep history of the changes made on a cloud provider. You can trace back changes to their owners, figure out reasoning behind changes, and have a backup of pushed issues. I decided to get to work using [Terraform](https://www.terraform.io/).

For those unfamiliar, Terraform is an infrastructure-as-code tool that lets you define and manage your cloud resources through configuration files rather than clicking through web dashboards. This makes your infrastructure reproducible, version-controlled, and easier to maintain.

All it takes is a configuration file. Supabase has a [provider source](https://registry.terraform.io/providers/supabase/supabase/latest) ready to manage projects. Terraform uses the term "resource" as a label for any service that can be edited using Terraform. For example, a Supabase project is an available resource we can edit through these config files.

It is unfortunate that not everything can be managed as a separate resource, but it makes sense: Supabase services are always running on their console.

### Provider Configuration
```hcl
# provider.tf
terraform {
  required_providers {
    supabase = {
      source = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

variable "SUPABASE_ACCESS_TOKEN" {
  type = string
  description = "private access token for supabase resource management"
  sensitive = true
}

provider "supabase" {
  access_token = var.SUPABASE_ACCESS_TOKEN
}
```

You should notice that there are a few uses of variables within these configs. By defining variables, we tell Terraform to expect these values as inputs from the user. Terraform allows for environment variables, and this way we can keep committed files clean of any private information.

To get your `SUPABASE_ACCESS_TOKEN`, head to your [Supabase Dashboard](https://supabase.com/dashboard) → Account Settings → Access Tokens and generate a new token with the appropriate permissions.

### Project Resources

Within the code below, we should see the "supabase_project" resource. We are able to define a few properties like the region and the database password.
```hcl
# main.tf
variable "SUPABASE_ORG_SLUG" {
  description = "organization slug used to id supabase project org"
  type = string
}

variable "SUPABASE_DATABASE_PASSWORD" {
  description = "used to create db. please keep private"
  type = string
  sensitive = true
}

resource "supabase_project" "hn_aggregator_v2" {
  organization_id = var.SUPABASE_ORG_SLUG
  name = "hn_aggregator_v2"
  database_password = var.SUPABASE_DATABASE_PASSWORD
  region = "ap-southeast-1"
  
  lifecycle {
    ignore_changes = [ database_password ]
  }
}

resource "supabase_settings" "dev" {
  project_ref = supabase_project.hn_aggregator_v2.id
}

output "supabase_project_id" {
  value       = supabase_project.hn_aggregator_v2.id
  description = "supabase project id"
}
```

The `lifecycle.ignore_changes` block is important here - it prevents Terraform from trying to reset your database password on subsequent runs. Once the database is created with the initial password, you don't want Terraform attempting to change it every time you apply updates.

## Setting Up Environment Variables

Rather than hardcoding sensitive values, we'll use environment variables. Create a `.env` file in your project root (and add it to `.gitignore`):
```bash
# .env
export TF_VAR_SUPABASE_ACCESS_TOKEN="your_access_token_here"
export TF_VAR_SUPABASE_ORG_SLUG="your_org_slug"
export TF_VAR_SUPABASE_DATABASE_PASSWORD="your_secure_password"
```

Before running Terraform commands, source this file:
```bash
source .env
```

Alternatively, you can create a `terraform.tfvars` file (also add to `.gitignore`):
```hcl
# terraform.tfvars
SUPABASE_ACCESS_TOKEN = "your_access_token_here"
SUPABASE_ORG_SLUG = "your_org_slug"
SUPABASE_DATABASE_PASSWORD = "your_secure_password"
```

## Running Terraform

Now that we have our configuration files ready, let's initialize and apply our infrastructure:
```bash
# Initialize Terraform and download the Supabase provider
terraform init

# Preview the changes that will be made
terraform plan

# Apply the changes and create your Supabase project
terraform apply
```

Terraform will show you a plan of what resources it will create. Review it carefully, then type `yes` to confirm. After a few moments, your Supabase project will be created and you'll see the project ID in the output.

## Setting Up the Supabase CLI

With your project created, the next step is setting up the [Supabase CLI](https://supabase.com/docs/guides/cli) for local development. Install it using npm:
```bash
npm install -g supabase
```

Or if you're on macOS with Homebrew:
```bash
brew install supabase/tap/supabase
```

Link your local environment to your Supabase project:
```bash
supabase login
supabase link --project-ref your_project_id
```

The CLI allows you to manage database migrations, run your project locally with [Docker](https://www.docker.com/), and sync your local schema with production. It's essential for a smooth development workflow.

Initialize your local Supabase configuration:
```bash
supabase init
```

This creates a `supabase/` directory with migration files and configuration. You can now create database migrations:
```bash
supabase migration new create_initial_schema
```

Edit the migration file in `supabase/migrations/` to define your database schema, then apply it:
```bash
supabase db push
```

## What's Next

With Terraform managing your infrastructure and the Supabase CLI handling your database migrations, you have a solid foundation for your project. Your setup is now:

- **Version controlled** - all infrastructure changes are tracked in [Git](https://git-scm.com/)
- **Reproducible** - you can spin up identical environments easily
- **Secure** - no secrets in your codebase
- **Professional** - following industry best practices

For my HN aggregator v2, the next steps are building out the database schema for storing posts, implementing the data collection pipeline, and creating the frontend to display aggregated content. The beauty of this setup is that I can iterate quickly while keeping everything organized and maintainable.

If you're building something similar, I hope this guide saves you some time. Happy building!

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Terraform Supabase Provider Documentation](https://registry.terraform.io/providers/supabase/supabase/latest/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Terraform Getting Started Guide](https://developer.hashicorp.com/terraform/tutorials/aws-get-started)
