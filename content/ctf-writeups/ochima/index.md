---
title: "Ochima"
date: 2026-03-26
draft: false
description: "OffSec Ochima writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Ochima

## Overview

- **OS:** Linux
- **IP:** 192.168.143.32
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

easy RCE with exploit and then privesc with cronjob.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames |  |
| Passwords |  |
| Usernames+Passwords |  |
| Hashes |  |
| Service Versions |  |

## Enumeration

## Nmap

```
tarting Nmap 7.95 ( https://nmap.org ) at 2026-03-26 09:53 EDT
Nmap scan report for 192.168.143.32
Host is up (0.083s latency).
Not shown: 65532 filtered tcp ports (no-response)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 b9:bc:8f:01:3f:85:5d:f9:5c:d9:fb:b6:15:a0:1e:74 (ECDSA)
|_  256 53:d9:7f:3d:22:8a:fd:57:98:fe:6b:1a:4c:ac:79:67 (ED25519)
80/tcp   open  http    Apache httpd 2.4.52 ((Ubuntu))
|_http-title: Apache2 Ubuntu Default Page: It works
|_http-server-header: Apache/2.4.52 (Ubuntu)
8338/tcp open  http    Python http.server 3.5 - 3.10
|_http-server-header: Maltrail/0.52
|_http-title: Maltrail
| http-robots.txt: 1 disallowed entry 
|_/

```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 856.png" >}}

## Port 8338

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 857.png" >}}

{{< figure src="image 858.png" >}}

## Exploitation

Once the primitive was confirmed, I converted it into a stable foothold and chained it forward.

{{< figure src="image 859.png" >}}

{{< figure src="image 860.png" >}}

```
 side)
## filter_netmask(s) is/are used to filter results
USERS
    admin:9ab3cd9d67bf49d01f6a2e33d0bd9bc804ddbe6ce1ff5d219c42624851db5dbc:0:                        # changeme!
## local:9ab3cd9d67bf49d01f6a2e33d0bd9bc804ddbe6ce1ff5d219c42624851db5dbc:1000:192.168.0.0/16       # changeme!

## Mask custom trail names for non-admin users (UID >= 1000)
ENABLE_MASK_CUSTOM true

```

{{< figure src="image 861.png" >}}

i think there is a cron job running given the existence of the etc_backup.tar file

{{< figure src="image 862.png" >}}

{{< figure src="image 863.png" >}}
