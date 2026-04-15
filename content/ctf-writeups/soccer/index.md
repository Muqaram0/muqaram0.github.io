---
title: "Soccer"
date: 2025-12-30
draft: false
description: "HackTheBox Soccer writeup"
tags: ["hackthebox", "htb", "linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Soccer

## Overview

- **OS:** Linux
- **IP:** 10.129.18.173
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

got shell found exposed site under nginx, found sqli boolean based, used sql map got table with creds, winrm with creds and privesc with doas suid enabled.

## Loot

| Credentials | TinyFile :- admin/admin@123 |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |

**Takeaways**

## Enumeration

```
    nmap -sCV -A --min-rate 1000 10.129.18.173
    Starting Nmap 7.95 ( https://nmap.org ) at 2025-12-30 11:38 EST
    Nmap scan report for 10.129.18.173
    Host is up (0.18s latency).
    Not shown: 997 closed tcp ports (reset)
    PORT     STATE SERVICE         VERSION
    22/tcp   open  ssh             OpenSSH 8.2p1 Ubuntu 4ubuntu0.5 (Ubuntu Linux; protocol 2.0)
    | ssh-hostkey: 
    |   3072 ad:0d:84:a3:fd:cc:98:a4:78:fe:f9:49:15:da:e1:6d (RSA)
    |   256 df:d6:a3:9f:68:26:9d:fc:7c:6a:0c:29:e9:61:f0:0c (ECDSA)
    |_  256 57:97:56:5d:ef:79:3c:2f:cb:db:35:ff:f1:7c:61:5c (ED25519)
    80/tcp   open  http            nginx 1.18.0 (Ubuntu)
    |_http-server-header: nginx/1.18.0 (Ubuntu)
    |_http-title: Did not follow redirect to http://soccer.htb/
    9091/tcp open  xmltec-xmlmail?
    | fingerprint-strings: 
    |   DNSStatusRequestTCP, DNSVersionBindReqTCP, Help, RPCCheck, SSLSessionReq, drda, informix: 
    |     HTTP/1.1 400 Bad Request
    |     Connection: close
    |   GetRequest: 
    |     HTTP/1.1 404 Not Found
    |     Content-Security-Policy: default-src 'none'
    |     X-Content-Type-Options: nosniff
    |     Content-Type: text/html; charset=utf-8
    |     Content-Length: 139
    |     Date: Tue, 30 Dec 2025 16:39:07 GMT
    |     Connection: close
    |     <!DOCTYPE html>
    |     <html lang="en">
    |     <head>
    |     <meta charset="utf-8">
    |     <title>Error</title>
    |     </head>
    |     <body>
    |     <pre>Cannot GET /</pre>
    |     </body>
    |     </html>
    |   HTTPOptions, RTSPRequest: 
    |     HTTP/1.1 404 Not Found
    |     Content-Security-Policy: default-src 'none'
    |     X-Content-Type-Options: nosniff
    |     Content-Type: text/html; charset=utf-8
    |     Content-Length: 143
    |     Date: Tue, 30 Dec 2025 16:39:08 GMT
    |     Connection: close
    |     <!DOCTYPE html>
    |     <html lang="en">
    |     <head>
    |     <meta charset="utf-8">
    |     <title>Error</title>
    |     </head>
    |     <body>
    |     <pre>Cannot OPTIONS /</pre>
    |     </body>
    |_    </html>
    1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
    SF-Port9091-TCP:V=7.95%I=7%D=12/30%Time=69540027%P=x86_64-pc-linux-gnu%r(i
    SF:nformix,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnection:\x20close\
    SF:r\n\r\n")%r(drda,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnection:\
    SF:x20close\r\n\r\n")%r(GetRequest,168,"HTTP/1\.1\x20404\x20Not\x20Found\r
    SF:\nContent-Security-Policy:\x20default-src\x20'none'\r\nX-Content-Type-O
    SF:ptions:\x20nosniff\r\nContent-Type:\x20text/html;\x20charset=utf-8\r\nC
    SF:ontent-Length:\x20139\r\nDate:\x20Tue,\x2030\x20Dec\x202025\x2016:39:07
    SF:\x20GMT\r\nConnection:\x20close\r\n\r\n<!DOCTYPE\x20html>\n<html\x20lan
    SF:g=\"en\">\n<head>\n<meta\x20charset=\"utf-8\">\n<title>Error</title>\n<
    SF:/head>\n<body>\n<pre>Cannot\x20GET\x20/</pre>\n</body>\n</html>\n")%r(H
    SF:TTPOptions,16C,"HTTP/1\.1\x20404\x20Not\x20Found\r\nContent-Security-Po
    SF:licy:\x20default-src\x20'none'\r\nX-Content-Type-Options:\x20nosniff\r\
    SF:nContent-Type:\x20text/html;\x20charset=utf-8\r\nContent-Length:\x20143
    SF:\r\nDate:\x20Tue,\x2030\x20Dec\x202025\x2016:39:08\x20GMT\r\nConnection
    SF::\x20close\r\n\r\n<!DOCTYPE\x20html>\n<html\x20lang=\"en\">\n<head>\n<m
    SF:eta\x20charset=\"utf-8\">\n<title>Error</title>\n</head>\n<body>\n<pre>
    SF:Cannot\x20OPTIONS\x20/</pre>\n</body>\n</html>\n")%r(RTSPRequest,16C,"H
    SF:TTP/1\.1\x20404\x20Not\x20Found\r\nContent-Security-Policy:\x20default-
    SF:src\x20'none'\r\nX-Content-Type-Options:\x20nosniff\r\nContent-Type:\x2
    SF:0text/html;\x20charset=utf-8\r\nContent-Length:\x20143\r\nDate:\x20Tue,
    SF:\x2030\x20Dec\x202025\x2016:39:08\x20GMT\r\nConnection:\x20close\r\n\r\
    SF:n<!DOCTYPE\x20html>\n<html\x20lang=\"en\">\n<head>\n<meta\x20charset=\"
    SF:utf-8\">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot\x20OPTIONS
    SF:\x20/</pre>\n</body>\n</html>\n")%r(RPCCheck,2F,"HTTP/1\.1\x20400\x20Ba
    SF:d\x20Request\r\nConnection:\x20close\r\n\r\n")%r(DNSVersionBindReqTCP,2
    SF:F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnection:\x20close\r\n\r\n")
    SF:%r(DNSStatusRequestTCP,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nConnec
    SF:tion:\x20close\r\n\r\n")%r(Help,2F,"HTTP/1\.1\x20400\x20Bad\x20Request\
    SF:r\nConnection:\x20close\r\n\r\n")%r(SSLSessionReq,2F,"HTTP/1\.1\x20400\
    SF:x20Bad\x20Request\r\nConnection:\x20close\r\n\r\n");
    Device type: general purpose|router
    Running: Linux 4.X|5.X, MikroTik RouterOS 7.X
    OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
    OS details: Linux 4.15 - 5.19, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
    Network Distance: 2 hops
    Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
    
    TRACEROUTE (using port 1025/tcp)
    HOP RTT       ADDRESS
    1   184.28 ms 10.10.14.1
    2   188.50 ms 10.129.18.173
    
    OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
    Nmap done: 1 IP address (1 host up) scanned in 35.08 seconds
```

Found this with dirbuster

{{< figure src="image 258.png" >}}

- **Vulnerabilties**

Tiny file manager

## Exploitation

so the default creds worked admin/admin@123

{{< figure src="image 259.png" >}}

Seems like the files are being saved in this path

{{< figure src="image 260.png" >}}

[https://febin0x4e4a.wordpress.com/2022/01/23/tiny-file-manager-authenticated-rce/](https://febin0x4e4a.wordpress.com/2022/01/23/tiny-file-manager-authenticated-rce/)

We are meeting an error where we are not allowd to write in the specified folder

{{< figure src="image 261.png" >}}

lets try path traversal acco. to the blog we found

by giving a rubbish url we get the file path where the stuff is being stored

{{< figure src="image 262.png" >}}

**/var/www/html/tiny/tinyfilemanager.php**

{{< figure src="image 263.png" >}}

we were able to upload it in the /uploads/ directory and on viewing it we get our php shell

found this soccer player but we dont have perms to view the flag wha

{{< figure src="image 264.png" >}}

hmm lets look around

after discovering the subdomain soc-player.soccer.htb under site-enabled directory we add it to our vi /etc/hosts and have this page with us

{{< figure src="image 265.png" >}}

right off the bat i notice the menu bars

there is this portal that we come accross

{{< figure src="image 266.png" >}}

and under check we find this

{{< figure src="image 267.png" >}}

i think its cross checking the tickets with a backend for validity, lets try some sql payload

apparently it is vulnerable so we exploit it with sqlmap and get the creds for player

lets ssh as player

{{< figure src="image 268.png" >}}

{{< figure src="image 269.png" >}}

{{< figure src="image 270.png" >}}
