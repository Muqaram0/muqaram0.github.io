---
title: "Plum"
date: 2026-03-24
draft: false
description: "OffSec Plum writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Plum

## Overview

- **OS:** Linux
- **IP:** 192.168.143.28
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

RCE and simple exposed cred for privesc.

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
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey: 
|   3072 c9:c3:da:15:28:3b:f1:f8:9a:36:df:4d:36:6b:a7:44 (RSA)
|   256 26:03:2b:f6:da:90:1d:1b:ec:8d:8f:8d:1e:7e:3d:6b (ECDSA)
|_  256 fb:43:b2:b0:19:2f:d3:f6:bc:aa:60:67:ab:c1:af:37 (ED25519)
80/tcp open  http    Apache httpd 2.4.56 ((Debian))
|_http-title: PluXml - Blog or CMS, XML powered !
|_http-server-header: Apache/2.4.56 (Debian)
Device type: general purpose
Running: Linux 5.X

```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 818.png" >}}

admin:admin worked

{{< figure src="image 819.png" >}}

## Exploitation

Once the primitive was confirmed, I converted it into a stable foothold and chained it forward.

{{< figure src="image 820.png" >}}

[https://github.com/MoritzHuppert/CVE-2022-25018/blob/main/CVE-2022-25018.pdf](https://github.com/MoritzHuppert/CVE-2022-25018/blob/main/CVE-2022-25018.pdf)

{{< figure src="image 821.png" >}}

{{< figure src="image 822.png" >}}

{{< figure src="image 823.png" >}}

{{< figure src="image 824.png" >}}

{{< figure src="image 825.png" >}}

{{< figure src="image 826.png" >}}
