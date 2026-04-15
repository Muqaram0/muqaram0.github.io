---
title: "Clue"
date: 2026-03-15
draft: false
description: "OffSec Clue writeup"
tags: ["linux", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Clue

## Overview

- **OS:** Linux
- **IP:** 192.168.205.240
- **Difficulty:** Hard
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

This writeup covers the full attack path for Clue, including enumeration, exploitation, and privilege escalation.

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
Not shown: 65529 filtered tcp ports (no-response)
PORT     STATE SERVICE          VERSION
22/tcp   open  ssh              OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
| ssh-hostkey: 
|   2048 74:ba:20:23:89:92:62:02:9f:e7:3d:3b:83:d4:d9:6c (RSA)
|_  256 54:8f:79:55:5a:b0:3a:69:5a:d5:72:39:64:fd:07:4e (ECDSA)
80/tcp   open  http             Apache httpd 2.4.38
|_http-server-header: Apache/2.4.38 (Debian)
|_http-title: 403 Forbidden
139/tcp  open  netbios-ssn      Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
445/tcp  open  netbios-ssn      Samba smbd 4.9.5-Debian (workgroup: WORKGROUP)
3000/tcp open  http             Thin httpd
|_http-server-header: thin
|_http-title: Cassandra Web
8021/tcp open  freeswitch-event FreeSWITCH mod_event_socket
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose|router
Running (JUST GUESSING): Linux 4.X|5.X|2.6.X|3.X (97%), MikroTik RouterOS 7.X (97%)
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3 cpe:/o:linux:linux_kernel:2.6 cpe:/o:linux:linux_kernel:3 cpe:/o:linux:linux_kernel:6.0
Aggressive OS guesses: Linux 4.15 - 5.19 (97%), Linux 5.0 - 5.14 (97%), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3) (97%), Linux 2.6.32 - 3.13 (91%), Linux 3.10 - 4.11 (91%), Linux 3.2 - 4.14 (91%), Linux 3.4 - 3.10 (91%), Linux 4.15 (91%), Linux 2.6.32 - 3.10 (91%), Linux 4.19 - 5.15 (91%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 4 hops
Service Info: Hosts: 127.0.0.1, CLUE; OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
| smb2-time: 
|   date: 2026-03-15T11:55:55
|_  start_date: N/A
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
| smb-os-discovery: 
|   OS: Windows 6.1 (Samba 4.9.5-Debian)
|   Computer name: clue
|   NetBIOS computer name: CLUE\x00
|   Domain name: pg
|   FQDN: clue.pg
|_  System time: 2026-03-15T07:55:56-04:00
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
|_clock-skew: mean: 1h20m01s, deviation: 2h18m35s, median: 0s

TRACEROUTE (using port 80/tcp)
HOP RTT      ADDRESS
1   86.39 ms 192.168.45.1
2   86.35 ms 192.168.45.254
3   86.45 ms 192.168.251.1
4   86.46 ms 192.168.205.240

OS and Service detection performed. Please report any incorrect results at https://nm
```

## Dirbusting

```

```

## Port 80

{{< figure src="image 659.png" >}}

**CVE 2021 44521**

{{< figure src="image 660.png" >}}

## Port 8021 Free Switch

8021/tcp open  freeswitch-event FreeSWITCH mod_event_socke

{{< figure src="image 661.png" >}}

ok so the password seems to be different fromhe default **ClueCon**

{{< figure src="image 662.png" >}}

{{< figure src="image 663.png" >}}

so i used searchsploit and came across a read file exploit for cassandra web, and guessed yo this might let us read that config file for the password, and here we are

{{< figure src="image 664.png" >}}

lets move to exploitation section now

## Exploitation

ok so we have the password

{{< figure src="image 665.png" >}}

we can also

{{< figure src="image 666.png" >}}

which gives us the pass for cassandra as SecondBitetheApple330

the password is **StrongClueConEight021** great

{{< figure src="image 667.png" >}}

and we are in 

{{< figure src="image 668.png" >}}

i wasnt getting a connect bac, BUT ONUSING A OPEN PORT 3000 for cassandra i GOT IT, ALWAYS USE OPEN PORTS GUYS

{{< figure src="image 669.png" >}}

lets try changing our user to cassie

wget is buuustedddd

{{< figure src="image 670.png" >}}

we are able to su to cassie with the prev creds and 

{{< figure src="image 671.png" >}}

run linpeas

there is an id sitting here almost as if it was intentionally put there for us to use because its not supposed to be here by default

{{< figure src="image 672.png" >}}

so lets use it for the 2 people that are allowed to access root and anthoyn via ssh

and boom it worked for root

{{< figure src="image 673.png" >}}
