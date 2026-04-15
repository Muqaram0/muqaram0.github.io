---
title: "LaVita"
date: 2026-03-20
draft: false
description: "OffSec LaVita writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# LaVita

## Overview

- **OS:** Linux
- **IP:** 192.168.217.38
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

This writeup covers the full attack path for LaVita, including enumeration, exploitation, and privilege escalation.

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
22/tcp open  ssh     OpenSSH 8.4p1 Debian 5+deb11u2 (protocol 2.0)
| ssh-hostkey: 
|   3072 c9:c3:da:15:28:3b:f1:f8:9a:36:df:4d:36:6b:a7:44 (RSA)
|   256 26:03:2b:f6:da:90:1d:1b:ec:8d:8f:8d:1e:7e:3d:6b (ECDSA)
|_  256 fb:43:b2:b0:19:2f:d3:f6:bc:aa:60:67:ab:c1:af:37 (ED25519)
80/tcp open  http    Apache httpd 2.4.56 ((Debian))
|_http-title: W3.CSS Template
|_http-server-header: Apache/2.4.56 (Debian)
Device type: general purpose|router

```

## Dirbusting

```

```

## Port 80

{{< figure src="image 728.png" >}}

## Exploitation

{{< figure src="image 729.png" >}}

i came across this
