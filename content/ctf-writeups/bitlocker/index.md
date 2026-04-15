---
title: "BitLocker"
date: 2026-03-25
draft: false
description: "OffSec BitLocker writeup"
tags: ["linux", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# BitLocker

## Overview

- **OS:** Linux
- **IP:** 192.168.143.186
- **Difficulty:** Hard
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Exposed creds updated mysql db pass to work w authenticated rce and then privesc with creds in a process and thensudo perms over .py.

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
PORT     STATE  SERVICE    VERSION
22/tcp   open   ssh        OpenSSH 9.6p1 Ubuntu 3ubuntu13.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 f2:5a:a9:66:65:3e:d0:b8:9d:a5:16:8c:e8:16:37:e2 (ECDSA)
|_  256 9b:2d:1d:f8:13:74:ce:96:82:4e:19:35:f9:7e:1b:68 (ED25519)
80/tcp   open   http       Apache httpd
| http-git: 
|   192.168.143.186:80/.git/
|     Git repository found!
|     .git/config matched patterns 'user'
|     Repository description: Unnamed repository; edit this file 'description' to name the...
|_    Last commit message: created .env to store the database configuration 
|_http-server-header: Apache
|_http-title: Did not follow redirect to http://bitforge.lab/
3306/tcp open   mysql      MySQL (blocked - too many connection errors)
9000/tcp closed cslistener
Aggressive OS guesses: Linux 5.0 - 5.14 (98%), MikroTik RouterO
```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 827.png" >}}

{{< figure src="image 828.png" >}}

{{< figure src="image 829.png" >}}

{{< figure src="image 830.png" >}}

this tool has RCE if we get creds to authenticate with hmm,

## Gitdump

Repository artifacts here gave practical context that directly helped the next move.

{{< figure src="image 831.png" >}}

{{< figure src="image 832.png" >}}

{{< figure src="image 833.png" >}}

we got the mysql creds as **BitForgeAdmin** and pass as **B1tForG3S0ftw4r3S0lutions

doesnt work on the portal lets try msql**

## Mysql

{{< figure src="image 834.png" >}}

ok i had to refer to a writeup because i got lost after this, we can just change the cred like this

## Exploitation

```
UPDATE planning_user SET password='df5b909019c9b1659e86e0d6bf8da81d6fa3499e' WHERE user_id='ADM';
```

{{< figure src="image 835.png" >}}

and now we are able to login with default admin creds

{{< figure src="image 836.png" >}}

{{< figure src="image 837.png" >}}

{{< figure src="image 838.png" >}}

{{< figure src="image 839.png" >}}

dont know what this is about but on running pspy we were able to catch jacks password

{{< figure src="image 840.png" >}}

jack

**j4cKF0rg3@445**

{{< figure src="image 841.png" >}}

{{< figure src="image 842.png" >}}

{{< figure src="image 843.png" >}}
