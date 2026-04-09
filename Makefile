.PHONY: plan apply

plan:
	terraform -chdir=terraform plan -var-file=terraform.tfvars

apply:
	terraform -chdir=terraform apply -var-file=terraform.tfvars
