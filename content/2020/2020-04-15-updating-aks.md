---
date: 2020-04-15
title: "Updating and Patching AKS"
cover: "https://unsplash.it/400/300/?random?BigTest"
slug: update-patch-aks
categories: 
    - Tech
    - AKS
tags:
    - AKS
---

Recently I came across two situations where I had to make changes to some components in an AKS cluster with minimum impact. I didn't want to be applying the full `yaml` files again since I was not too familiar with this particular set up.

## Updating an image

The first change I had to make was a replace of a docker image that one of the services was using. For that I updated the AKS deployment.

```bash
# Updates the Image
kubectl set image deployment/iothub-manager iothub-manager-pod=goncalvesj/iothub-manager-dotnet:01 --record
# Checks status
kubectl rollout status deployment/iothub-manager
# If something goes wrong use this to rollback the update
kubectl rollout undo deployment/iothub-manager
```

## Updating an Ingress

The second change was to expose another service in an ingress controller, for that I used a combination of `JSON` and the `kubectl` patch command.

```JSON
# JSON to add one extra path and service.
# This will append the extra path at the end of the ingress controller paths section.
[
  {
    "op": "add",
    "path": "/spec/rules/0/http/paths/-",
    "value": {
      "path": "/storageadapter",
      "backend": {
        "serviceName": "storage-adapter-svc",
        "servicePort": 9022
      }
    }
  }
]
```

```bash
# Executes the patch
kubectl patch ingress remotemonitoring --type json -p "$(cat patch.json)"
```

**Hope this helped!**
