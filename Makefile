.PHONY: init plan apply

init:
	terraform -chdir=terraform init

plan:
	terraform -chdir=terraform plan -var-file=terraform.tfvars

apply:
	terraform -chdir=terraform apply -var-file=terraform.tfvars
