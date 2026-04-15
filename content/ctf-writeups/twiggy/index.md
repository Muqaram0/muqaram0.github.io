---
title: "Twiggy"
date: 2026-03-13
draft: false
description: "OffSec Twiggy writeup"
tags: ["linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Twiggy

## Overview

- **OS:** Linux
- **IP:** 192.168.165.62
- **Difficulty:** Easy
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Found a exposed api endpoint, which was using an outdated salt version that had an RCE vuln associated w it.

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
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-13 06:47 EDT
Nmap scan report for 192.168.165.62
Host is up (0.084s latency).
Not shown: 996 filtered tcp ports (no-response)
PORT     STATE SERVICE VERSION
**22/tcp   open  ssh     OpenSSH 7.4 (protocol 2.0)**
| ssh-hostkey: 
|   2048 44:7d:1a:56:9b:68:ae:f5:3b:f6:38:17:73:16:5d:75 (RSA)
|   256 1c:78:9d:83:81:52:f4:b0:1d:8e:32:03:cb:a6:18:93 (ECDSA)
|_  256 08:c9:12:d9:7b:98:98:c8:b3:99:7a:19:82:2e:a3:ea (ED25519)
53/tcp   open  domain  NLnet Labs NSD
**80/tcp   open  http    nginx 1.16.1**
|_http-title: Home | **Mezzanine**
|_http-server-header: nginx/1.16.1
**8000/tcp open  http    nginx 1.16.1**
|_http-title: Site doesn't have a title (application/json).
|_http-open-proxy: Proxy might be redirecting requests
|_http-server-header: nginx/1.16.1

4505/tcp open  zmtp    ZeroMQ ZMTP 2.0
4506/tcp open  zmtp    ZeroMQ ZMTP 2.0
8000/tcp open  http    nginx 1.16.1
|_http-title: Site doesn't have a title (application/json).
|_http-server-header: nginx/1.16.1
|_http-open-proxy: Proxy might be redirecting requests
Warning: OSScan results may be unreliable because w

```

## Dirbusting

```
nothin 
```

## Port 4505 & 4506

ZeroMQ ZMTP 2.0

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 623.png" >}}

## Exploitation

On looking this up

{{< figure src="image 624.png" >}}

We come across this exploit i found online for this version

{{< figure src="image 625.png" >}}

lets start a venv

```
python -m venv venv
source venv/bin/ctivate
```

{{< figure src="image 626.png" >}}

```
https://github.com/jasperla/CVE-2020-11651-poc/blob/master/README.md
```

and boom we got our rev shell, had to change the port we were using to avoid the firewall from catching on 

{{< figure src="image 627.png" >}}
