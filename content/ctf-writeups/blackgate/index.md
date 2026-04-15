---
title: "BlackGate"
date: 2026-03-14
draft: false
description: "OffSec BlackGate writeup"
tags: ["linux", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# BlackGate

## Overview

- **OS:** Linux
- **IP:** 192.168.133.176
- **Difficulty:** Hard
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

redis based rce and privesc with pwnkit.

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
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.3p1 Ubuntu 1ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 37:21:14:3e:23:e5:13:40:20:05:f9:79:e0:82:0b:09 (RSA)
|   256 b9:8d:bd:90:55:7c:84:cc:a0:7f:a8:b4:d3:55:06:a7 (ECDSA)
|_  256 07:07:29:7a:4c:7c:f2:b0:1f:3c:3f:2b:a1:56:9e:0a (ED25519)
6379/tcp open  redis   Redis key-value store 4.0.14
Device type: general purpose|router
Running: Linux 5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 5.0 - 5.14, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 4 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 1720/tcp)
HOP RTT      ADDRESS
1   90.11 ms 192.168.45.1
2   90.08 ms 192.168.45.254
3   90.15 ms 192.168.251.1
4   90.20 ms 192.168.133.176

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 17.38 seconds

```

## Dirbusting

```

```

## Port 80

## Exploitation

{{< figure src="image 646.png" >}}

using this we have our shell

{{< figure src="image 647.png" >}}

we can run redis-status binary apparently lets check that out

{{< figure src="image 648.png" >}}

```
$ sudo -l
nMatching Defaults entries for prudence on blackgate:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin
User prudence may run the following commands on blackgate:
    (root) NOPASSWD: /usr/local/bin/redis-status
$ strings /usr/local/bin/redis-status
n/lib64/ld-linux-x86-64.so.2
gets
puts
printf
stderr
system
fwrite
strcmp
__libc_start_main
libc.so.6
GLIBC_2.2.5
__gmon_start__
H=X@@
[]A\A]A^A_

```

we are able to escalate our privs with a kernel exploit

{{< figure src="image 649.png" >}}
