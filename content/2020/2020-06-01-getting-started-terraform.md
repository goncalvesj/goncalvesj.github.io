---
date: 2020-06-01
title: "Getting Started with Terraform"
cover: "https://unsplash.it/400/300/?random?BigTest"
slug: getting-started-terraform
categories: 
    - Azure
    - Terraform
tags:
    - Terraform
    - Azure
---

For most of projects that I worked on, when we had the chance of creating infrastructure as code the decision was always to go to ARM templates. Mostly because the skillset of the team was favourable to that technology.

Out of my own curiosity I decided to try terraform, not just to learn a different tool for `IaC` but also because the `terraform plan` and `terraform apply` functionalities are really useful when you're creating infrastructure.

Also because of the support that Microsoft is giving this tool, being now documented in their own docs, and the interesting fact that Azure uses the `Hashcorp Packer` tool to build the Azure VMs base images. Makes me think that this relationship is going to last quite a bit and it's definitely worth investing some time on it.

## Getting Started

Let's start by listing the prerequisites for working with Terraform on Azure:

- [Terraform CLI](https://learn.hashicorp.com/terraform/getting-started/install.html)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest)

After installing you need to connect to your azure subscription.

```bash
# Login to Azure
az login
# Set subcription if you have more than one
az account set -s SUBSCRIPTIONID
```

## Creating Resources

Now that we are connected to the cloud we can start setting up our infrastructure.

The steps below will create an Azure Resource Group, an Azure App Service Plan and an App Service that uses a Docker image.

1. Create a file `resources.tf`
2. Set a provider

    ```YAML
    # Sets Azure as our provider
    provider "azurerm" {
        version = "=2.0.0"
        features {}
    }
    ```

3. Create a resource group

    ```YAML
    resource "azurerm_resource_group" "example" {
        name     = "RG-Containers"
        location = "North Europe"
    }
    ```

4. Create an App Service Plan on Linux

    ```YAML
    resource "azurerm_app_service_plan" "example" {
        name                = "RG-AppPlan-Linux"
        location            = azurerm_resource_group.example.location
        resource_group_name = azurerm_resource_group.example.name
        kind                = "Linux"
        reserved            = true

        sku {
            tier = "Basic"
            size = "B1"
        }
    }
    ```

5. Create an App Service that uses a Docker image

    ```YAML
    resource "azurerm_app_service" "dockerapp" {
        name                = "goncalvesj-ncngb2c"
        location            = azurerm_resource_group.example.location
        resource_group_name = azurerm_resource_group.example.name
        app_service_plan_id = azurerm_app_service_plan.example.id
        https_only          = true

        app_settings = {
            WEBSITES_ENABLE_APP_SERVICE_STORAGE = false
        }

        site_config {
            linux_fx_version = "DOCKER|goncalvesj/netcore-angular-b2c:dev"
            always_on        = "true"
        }

        identity {
            type = "SystemAssigned"
        }
    }
    ```

6. Optional - Create a remote backend

    Terraform has the functionality of having a remote backend to store the state of our infrasctruture. If you're working on a big team and there might be cases of multiple people working at the same time on the infrastrucure side you should use a remote backend to avoid conflicts and concurrent updates.

    The below uses Azure Storage accounts as a remote backend and the storage needs to be created beforehand.

    ```YAML
    terraform {
        backend "azurerm" {
            resource_group_name  = "RG-Storage"
            storage_account_name = "goncalvesjtfbackends"
            container_name       = "tfstate"
            key                  = "azureappservicedocker.terraform.tfstate"
        }
    }
    ```

7. Run `terraform plan` to create an output of what is going to be added, changed or deleted.

8. Then if you're happy with the changes, run `terraform apply` and watch all the resources getting created on Azure.

**Hope this helped!Reach out to me on twitter if you have any questions!**
