---
date: 2025-08-26
title: "Fixing Azure Dev Box network connection issues"
cover: "https://unsplash.it/400/300/?random?cloud"
slug: azure-dev-box-network-connections
categories: 
    - Azure
    - Dev Box
tags:
    - Azure
    - Dev Box
    - Networking
---

I recently hit a frustrating issue where my Dev Center network connections started showing errors, and as a result I was not able to connect to my Dev Boxes.

## Symptoms

- Dev Center > Network connections shows Failed status on Endpoint connectivity
- Connecting to the Dev Box through the browser or Windows App fails

## Current setup

- Route table only had a few specific routes, no 0.0.0.0/0 route
- Firewall had an allow-all network rule for traffic coming from the Dev Box VNET
- NSG rules were default

## Root cause

- An automated process disabled the subnet property `defaultOutboundAccess`
- Announced in [Azure updates](https://azure.microsoft.com/en-us/updates?id=default-outbound-access-for-vms-in-azure-will-be-retired-transition-to-a-new-method-of-internet-access)
- This removes the platform-provided outbound path and breaks public internet egress when no NAT/Firewall is configured, virtual machines and subnets that were created in a virtual network without a defined explicit outbound method were assigned a default public IP address that enables public endpoint connectivity.

## What fixed it for me

1) Attached a dedicated NAT Gateway to the Dev Box subnet
2) In Dev Center, opened the Network Connection and clicked "Update status" on the network connection to run the checks again; endpoint connectivity then passed and outbound worked
3) Confirm Dev Box connectivity is restored
