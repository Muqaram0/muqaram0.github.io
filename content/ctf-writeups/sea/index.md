---
title: "Sea"
date: 2026-03-26
draft: false
description: "OffSec Sea writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Sea

## Overview

- **OS:** Linux
- **IP:** 192.168.143.162
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

exposed creds.

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
PORT      STATE SERVICE VERSION
21/tcp    open  ftp     vsftpd 3.0.5
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 192.168.45.159
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 2
|      vsFTPd 3.0.5 - secure, fast, stable
|_End of status
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -rw-rw-r--    1 0        0            5637 Jun 14  2025 log_01.log
| -rw-rw-r--    1 0        0            7181 Jun 15  2025 log_02.log
| -rw-rw-r--    1 0        0            5627 Jun 14  2025 log_03.log
|_-rw-rw-r--    1 0        0            5687 Jun 14  2025 log_04.log
22/tcp    open  ssh     OpenSSH 9.6p1 Ubuntu 3ubuntu13.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 f2:5a:a9:66:65:3e:d0:b8:9d:a5:16:8c:e8:16:37:e2 (ECDSA)
|_  256 9b:2d:1d:f8:13:74:ce:96:82:4e:19:35:f9:7e:1b:68 (ED25519)
80/tcp    open  http    Apache httpd 2.4.58 ((Ubuntu))
|_http-server-header: Apache/2.4.58 (Ubuntu)
|_http-title: Villa Agency - Real Estate HTML5 Template
55743/tcp open  http    Apache httpd 2.4.58 ((Ubuntu))
| http-cookie-flags: 
|   /: 
|     PHPSESSID: 
|_      httponly flag not set
|_http-server-header: Apache/2.4.58 (Ubuntu)
|_http-title: Sea
Device type: general purpose
Running: Linux 5.X
OS CPE: cpe:/o:linux:linux_kernel:5

```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 850.png" >}}

## Port 55743

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 851.png" >}}

## FTP

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 852.png" >}}

## Exploitation

{{< figure src="image 853.png" >}}

these dont seem to work then i realized that i was loojking at the wrong directory

{{< figure src="image 854.png" >}}

well the old pass worked for root 

{{< figure src="image 855.png" >}}
