---
title: "PyLoader"
date: 2026-03-23
draft: false
description: "OffSec PyLoader writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# PyLoader

## Overview

- **OS:** Linux
- **IP:** 192.168.143.26
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

direct root thru exploit.

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
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 b9:bc:8f:01:3f:85:5d:f9:5c:d9:fb:b6:15:a0:1e:74 (ECDSA)
|_  256 53:d9:7f:3d:22:8a:fd:57:98:fe:6b:1a:4c:ac:79:67 (ED25519)
9666/tcp open  http    CherryPy wsgiserver
| http-title: Login - pyLoad 
|_Requested resource was /login?next=http://192.168.143.26:9666/
| http-robots.txt: 1 disallowed entry 
|_/
|_http-server-header: Cheroot/8.6.0
Device type: general purpose|router
Running: Linux 5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 5.0 - 5.14, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 4 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

## Dirbusting

```

```

## Port 9666

I validated this step using the evidence below before moving forward in the chain.

Default creds

**pyload:pyload**

{{< figure src="image 795.png" >}}

## Exploitation

Once the primitive was confirmed, I converted it into a stable foothold and chained it forward.

{{< figure src="image 796.png" >}}

{{< figure src="image 797.png" >}}

0.5.0

[https://www.exploit-db.com/exploits/51532](https://www.exploit-db.com/exploits/51532)

[https://github.com/advisories/GHSA-3f7w-p8vr-4v5f](https://github.com/advisories/GHSA-3f7w-p8vr-4v5f)

{{< figure src="image 798.png" >}}

and boom root so easy
