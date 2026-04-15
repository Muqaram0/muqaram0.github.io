---
title: "Exfiltrated"
date: 2026-03-13
draft: false
description: "OffSec Exfiltrated writeup"
tags: ["linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Exfiltrated

## Overview

- **OS:** Linux
- **IP:** 192.168.165.98
- **Difficulty:** Easy
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

cron that was runnin exiftool vulnerable to rce.

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
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 c1:99:4b:95:22:25:ed:0f:85:20:d3:63:b4:48:bb:cf (RSA)
|   256 0f:44:8b:ad:ad:95:b8:22:6a:f0:36:ac:19:d0:0e:f3 (ECDSA)
|_  256 32:e1:2a:6c:cc:7c:e6:3e:23:f4:80:8d:33:ce:9b:3a (ED25519)
**80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))**
|_http-title: Did not follow redirect to http://exfiltrated.offsec/
|_http-server-header: Apache/2.4.41 (Ubuntu)
**| http-robots.txt: 7 disallowed entries 
| /backup/ /cron/? /front/ /install/ /panel/ /tmp/ 
|_/updates/**

```

Lets add exfiltrated.offsec to our hosts file

## Dirbusting

```

```

## Port 80

{{< figure src="image 605.png" >}}

{{< figure src="image 606.png" >}}

Subrion CMS v4.2.1

Searching that gets us this

File Upload —> RCE , but it is Authenticated so lets keep it in mind for now

[Subrion CMS 4.2.1 - Arbitrary File Upload](https://www.exploit-db.com/exploits/49876)

## /robots.txt

```

Disallow: /install/
Disallow: /panel/
Disallow: /tmp/
Disallow: /updates/
```

## Exploitation

we were able to login to the administrator panel with default creds

{{< figure src="image 607.png" >}}

lets go ahead with authenticated file upload

{{< figure src="image 608.png" >}}

Now that we are in lets try to privesc

{{< figure src="image 609.png" >}}

{{< figure src="image 610.png" >}}

{{< figure src="image 611.png" >}}

apparently there is a cron job running [image-exif.sh](http://image-exif.sh) and a file in the root directory called swap.img

on serarching exiftool exploit we get

[https://github.com/UNICORDev/exploit-CVE-2021-22204](https://github.com/UNICORDev/exploit-CVE-2021-22204)

{{< figure src="image 612.png" >}}

{{< figure src="image 613.png" >}}

now lets wait a min

and we are root
