---
title: "vmdak"
date: 2026-03-26
draft: false
description: "OffSec vmdak writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# vmdak

## Overview

- **OS:** Linux
- **IP:** 192.168.143.103
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Initial access through rce exploit and then privesc thorough exposed creds and exposed jenkins interface on local port.

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
PORT     STATE SERVICE  VERSION
21/tcp   open  ftp      vsftpd 3.0.5
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
|_-rw-r--r--    1 0        0            1752 Sep 19  2024 config.xml
22/tcp   open  ssh      OpenSSH 9.6p1 Ubuntu 3ubuntu13.4 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 76:18:f1:19:6b:29:db:da:3d:f6:7b:ab:f4:b5:63:e0 (ECDSA)
|_  256 cb:d8:d6:ef:82:77:8a:25:32:08:dd:91:96:8d:ab:7d (ED25519)
80/tcp   open  http     Apache httpd 2.4.58 ((Ubuntu))
|_http-server-header: Apache/2.4.58 (Ubuntu)
|_http-title: Apache2 Ubuntu Default Page: It works
9443/tcp open  ssl/http Apache httpd 2.4.58 ((Ubuntu))
|_http-server-header: Apache/2.4.58 (Ubuntu)
| tls-alpn: 
|_  http/1.1
|_ssl-date: TLS randomness does not represent time
| ssl-cert: Subject: commonName=vmdak.local/organizationName=PrisonManagement/stateOrProvinceName=California/countryName=US
| Subject Alternative Name: DNS:vmdak.local
| Not valid before: 2024-08-20T09:21:33
|_Not valid after:  2025-08-20T09:21:33
|_http-title:  Home - Prison Management System

```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 864.png" >}}

## Port 9443

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 865.png" >}}

## FTP

I validated this step using the evidence below before moving forward in the chain.

```
Connected to 192.168.143.103.
220 (vsFTPd 3.0.5)
Name (192.168.143.103:kali): Anonymous
331 Please specify the password.
Password: 
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> ls
229 Entering Extended Passive Mode (|||27358|)
150 Here comes the directory listing.
-rw-r--r--    1 0        0            1752 Sep 19  2024 config.xml
226 Directory send OK.
ftp> get config.xml
local: config.xml remote: config.xml
229 Entering Extended Passive Mode (|||29902|)
150 Opening BINARY mode data connection for config.xml (1752 bytes).
100% |*************************************************************************************************|  1752       34.09 MiB/s    00:00 ETA
226 Transfer complete.
1752 bytes received in 00:00 (20.56 KiB/s)
ftp> 

```

config.xml file grabbed

{{< figure src="image 866.png" >}}

<disabledAdministrativeMonitors/>
<version>2.401.2</version>

{{< figure src="image 867.png" >}}

## Exploitation

{{< figure src="image 868.png" >}}

was able to bypass admin login form w sqlimal

{{< figure src="image 869.png" >}}

malcom :: RonnyCache001

{{< figure src="image 870.png" >}}

admin :: admin123

{{< figure src="image 871.png" >}}

{{< figure src="image 872.png" >}}

wow that was simple, i just changed the content type from php to image/jpeg and was able to upload then on rightclicking and visiting the image i got the shell

{{< figure src="image 873.png" >}}

{{< figure src="image 874.png" >}}

creds worked for vmdak

vmdak :: RonnyCache001

{{< figure src="image 875.png" >}}

{{< figure src="image 876.png" >}}

lets check this site out after portforwarding

{{< figure src="image 877.png" >}}

{{< figure src="image 878.png" >}}

we know from before the version of this particular jenkins sinstance and is vulnerable to path read so lets try using that

{{< figure src="image 879.png" >}}

{{< figure src="image 880.png" >}}
