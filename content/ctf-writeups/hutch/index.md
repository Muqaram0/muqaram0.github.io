---
title: "Hutch"
date: 2026-03-29
draft: false
description: "OffSec Hutch writeup"
tags: ["windows", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Hutch

## Overview

- **OS:** Windows
- **IP:** 192.168.222.122
- **Difficulty:** Hard
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

initial access thru creds leaked with —users ldap flag and then foothold with webdav cmdshell, privesc with exposed admin creds in laps.

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
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
80/tcp    open  http          Microsoft IIS httpd 10.0
| http-methods: 
|_  Potentially risky methods: TRACE COPY PROPFIND DELETE MOVE PROPPATCH MKCOL LOCK UNLOCK PUT
|_http-server-header: Microsoft-IIS/10.0
|_http-title: IIS Windows Server
| http-webdav-scan: 
|   WebDAV type: Unknown
|   Allowed Methods: OPTIONS, TRACE, GET, HEAD, POST, COPY, PROPFIND, DELETE, MOVE, PROPPATCH, MKCOL, LOCK, UNLOCK
|   Server Date: Sun, 29 Mar 2026 11:18:33 GMT
|   Server Type: Microsoft-IIS/10.0
|_  Public Options: OPTIONS, TRACE, GET, HEAD, POST, PROPFIND, PROPPATCH, MKCOL, PUT, DELETE, COPY, MOVE, LOCK, UNLOCK
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-03-29 11:17:39Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: hutch.offsec0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: hutch.offsec0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp  open  mc-nmf        .NET Message Framing
49666/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49673/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49674/tcp open  msrpc         Microsoft Windows RPC
49676/tcp open  msrpc         Microsoft Windows RPC
49692/tcp open  msrpc         Microsoft Windows RPC
49766/tcp open  msrpc         Microsoft Windows RPC
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows 2019|10 (92%)
OS CPE: cpe:/o:microsoft:windows_server_2019 cpe:/o:microsoft:windows_10
Aggressive OS guesses: Windows Server 2019 (92%), Microsoft Windows 10 1903 - 21H1 (85%), Microsoft Windows 10 1607 (85%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 4 hops

```

## Dirbusting

```

```

## LDAP

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 909.png" >}}

## Exploitation

Got Creds thru ldap as fmcsorley : CrabSharkJellyfish192

and we have users so lets try roasting first and see if we get more

### ASREP

{{< figure src="image 910.png" >}}

well lets fall back and check our access, we have rn access to LDAP and smb with these new creds so lets enumerate them

{{< figure src="image 911.png" >}}

leave this we are able to cadaver with these creds, lets gen a payload to use

{{< figure src="image 912.png" >}}

we put our webshell and ran this nice code i got from revshellgen

{{< figure src="image 913.png" >}}

{{< figure src="image 914.png" >}}

lets escalate now

Qn;0$-v3+W47W6
