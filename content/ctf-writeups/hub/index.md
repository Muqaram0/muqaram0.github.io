---
title: "Hub"
date: 2026-03-17
draft: false
description: "OffSec Hub writeup"
tags: ["linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Hub

## Overview

- **OS:** Linux
- **IP:** 192.168.105.25
- **Difficulty:** Easy
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

It was just a simple exploit.

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
PORT      STATE    SERVICE  VERSION
22/tcp    open     ssh      OpenSSH 8.4p1 Debian 5+deb11u1 (protocol 2.0)
| ssh-hostkey: 
|   3072 c9:c3:da:15:28:3b:f1:f8:9a:36:df:4d:36:6b:a7:44 (RSA)
|   256 26:03:2b:f6:da:90:1d:1b:ec:8d:8f:8d:1e:7e:3d:6b (ECDSA)
|_  256 fb:43:b2:b0:19:2f:d3:f6:bc:aa:60:67:ab:c1:af:37 (ED25519)
80/tcp    open     http     nginx 1.18.0
|_http-title: 403 Forbidden
|_http-server-header: nginx/1.18.0
6309/tcp  filtered unknown
6840/tcp  filtered unknown
8082/tcp  open     http     Barracuda Embedded Web Server
|_http-title: Home
|_http-server-header: BarracudaServer.com (Posix)
| http-methods: 
|_  Potentially risky methods: PROPFIND PATCH PUT COPY DELETE MOVE MKCOL PROPPATCH LOCK UNLOCK
| http-webdav-scan: 
|   Server Type: BarracudaServer.com (Posix)
|   Allowed Methods: OPTIONS, GET, HEAD, PROPFIND, PATCH, POST, PUT, COPY, DELETE, MOVE, MKCOL, PROPFIND, PROPPATCH, LOCK, UNLOCK
|   Server Date: Tue, 17 Mar 2026 13:47:25 GMT
|_  WebDAV type: Unknown
9999/tcp  open     ssl/http Barracuda Embedded Web Server
| ssl-cert: Subject: commonName=FuguHub/stateOrProvinceName=California/countryName=US
| Subject Alternative Name: DNS:FuguHub, DNS:FuguHub.local, DNS:localhost
| Not valid before: 2019-07-16T19:15:09
|_Not valid after:  2074-04-18T19:15:09
| http-webdav-scan: 
|   Server Type: BarracudaServer.com (Posix)
|   Allowed Methods: OPTIONS, GET, HEAD, PROPFIND, PATCH, POST, PUT, COPY, DELETE, MOVE, MKCOL, PROPFIND, PROPPATCH, LOCK, UNLOCK
|   Server Date: Tue, 17 Mar 2026 13:47:25 GMT
|_  WebDAV type: Unknown
|_http-server-header: BarracudaServer.com (Posix)
|_http-title: Home
| http-methods: 
|_  Potentially risky methods: PROPFIND PATCH PUT COPY DELETE MOVE MKCOL PROPPATCH LOCK UNLOCK
10477/tcp filtered unknown

```

## Dirbusting

```

```

## Port 8082

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 708.png" >}}

## Exploitation

{{< figure src="image 709.png" >}}

we set the admin account as admin:admin1234

{{< figure src="image 710.png" >}}

[https://github.com/SanjinDedic/FuguHub-8.4-Authenticated-RCE-CVE-2024-27697](https://github.com/SanjinDedic/FuguHub-8.4-Authenticated-RCE-CVE-2024-27697)

{{< figure src="image 711.png" >}}

{{< figure src="image 712.png" >}}

now clicking on about gives us a shell

{{< figure src="image 713.png" >}}
