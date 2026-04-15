---
title: "Press"
date: 2026-03-21
draft: false
description: "OffSec Press writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Press

## Overview

- **OS:** Linux
- **IP:** 192.168.126.29
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Initial access with default creds and magic byte file upload bypass, privesc with gtfobins.

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
Not shown: 65532 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey: 
|   3072 c9:c3:da:15:28:3b:f1:f8:9a:36:df:4d:36:6b:a7:44 (RSA)
|   256 26:03:2b:f6:da:90:1d:1b:ec:8d:8f:8d:1e:7e:3d:6b (ECDSA)
|_  256 fb:43:b2:b0:19:2f:d3:f6:bc:aa:60:67:ab:c1:af:37 (ED25519)
80/tcp   open  http    Apache httpd 2.4.56 ((Debian))
|_http-title: Lugx Gaming Shop HTML5 Template
|_http-server-header: Apache/2.4.56 (Debian)
8089/tcp open  http    Apache httpd 2.4.56 ((Debian))
|_http-server-header: Apache/2.4.56 (Debian)
|_http-generator: FlatPress fp-1.2.1
|_http-title: FlatPress
Device type: general purpose
Running: Linux 5.X

```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 742.png" >}}

## 8089

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 743.png" >}}

## Exploitation

{{< figure src="image 744.png" >}}

{{< figure src="image 745.png" >}}

{{< figure src="image 746.png" >}}

{{< figure src="image 747.png" >}}

i have a strong feeling this is the intended path so lets try bruteforcing the creds

after trying default creds admin:password we are in

{{< figure src="image 748.png" >}}

{{< figure src="image 749.png" >}}

{{< figure src="image 750.png" >}}

{{< figure src="image 751.png" >}}

## PrivESC

Local enumeration exposed the misconfiguration, and the escalation path below was enough to move up.

{{< figure src="image 752.png" >}}

{{< figure src="image 753.png" >}}

{{< figure src="image 754.png" >}}
