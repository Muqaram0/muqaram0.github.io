---
title: "RubyDome"
date: 2026-03-22
draft: false
description: "OffSec RubyDome writeup"
tags: ["linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# RubyDome

## Overview

- **OS:** Linux
- **IP:** 192.168.243.22
- **Difficulty:** Easy
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

RCE and then privesc with sudo -l.

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
nmap 192.168.243.22 -sCV -Pn -p- -A --min-rate=20000    
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-22 10:01 EDT
Nmap scan report for 192.168.243.22
Host is up (0.079s latency).
Not shown: 65533 closed tcp ports (reset)
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 b9:bc:8f:01:3f:85:5d:f9:5c:d9:fb:b6:15:a0:1e:74 (ECDSA)
|_  256 53:d9:7f:3d:22:8a:fd:57:98:fe:6b:1a:4c:ac:79:67 (ED25519)
3000/tcp open  http    WEBrick httpd 1.7.0 (Ruby 3.0.2 (2021-07-07))
|_http-title: RubyDome HTML to PDF
|_http-server-header: WEBrick/1.7.0 (Ruby/3.0.2/2021-07-07)
Device type: general purpose|router
Running: Linux 5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 5.0 - 5.14, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 4 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 554/tcp)
HOP RTT      ADDRESS
1   78.49 ms 192.168.45.1
2   78.43 ms 192.168.45.254
3   78.69 ms 192.168.251.1
4   78.82 ms 192.168.243.22

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 17.70 seconds

```

## Dirbusting

```

```

## Port 3000

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 772.png" >}}

## Exploitation

{{< figure src="image 773.png" >}}

lets search up ruby 3.0.2

{{< figure src="image 774.png" >}}

we found this exploit, on copying and running the payload after url encoding it w get our shell

{{< figure src="image 775.png" >}}

{{< figure src="image 776.png" >}}

{{< figure src="image 777.png" >}}

{{< figure src="image 778.png" >}}
