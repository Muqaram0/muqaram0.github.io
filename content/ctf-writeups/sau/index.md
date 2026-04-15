---
title: "sau"
date: 2025-12-15
draft: false
description: "HackTheBox sau writeup"
tags: ["hackthebox", "htb", "linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# sau

## Overview

- **OS:** Linux
- **IP:** 10.129.229.26
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

SSRF practice + RCE followed with pager based shell escape for root access.

## Loot

| ssh-hostkey: 
|   3072 aa:88:67:d7:13:3d:08:3a:8a:ce:9d:c4:dd:f3:e1:ed (RSA)
|   256 ec:2e:b1:05:87:2a:0c:7d:b1:49:87:64:95:dc:8a:21 (ECDSA)
|_  256 b3:0c:47:fb:a2:f2:12:cc:ce:0b:58:82:0e:50:43:36 (ED25519)

- Enumeration
- **Nmap scan**

```
        Starting Nmap 7.94SVN ( https://nmap.org ) at 2025-12-15 10:39 EST
        Nmap scan report for 10.129.229.26
        Host is up (0.19s latency).
        Not shown: 997 closed tcp ports (reset)
        PORT      STATE    SERVICE VERSION
        22/tcp    open     ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.7 (Ubuntu Linux; protocol 2.0)
        80/tcp    filtered http
        55555/tcp open     unknown
        | fingerprint-strings: 
        |   FourOhFourRequest: 
        |     HTTP/1.0 400 Bad Request
        |     Content-Type: text/plain; charset=utf-8
        |     X-Content-Type-Options: nosniff
        |     Date: Mon, 15 Dec 2025 15:40:21 GMT
        |     Content-Length: 75
        |     invalid basket name; the name does not match pattern: ^[wd-_\.]{1,250}$
        |   GenericLines, Help, Kerberos, LDAPSearchReq, LPDString, RTSPRequest, SSLSessionReq, TLSSessionReq, TerminalServerCookie: 
        |     HTTP/1.1 400 Bad Request
        |     Content-Type: text/plain; charset=utf-8
        |     Connection: close
        |     Request
        |   GetRequest: 
        |     HTTP/1.0 302 Found
        |     Content-Type: text/html; charset=utf-8
        |     Location: /web
        |     Date: Mon, 15 Dec 2025 15:39:51 GMT
        |     Content-Length: 27
        |     href="/web">Found</a>.
        |   HTTPOptions: 
        |     HTTP/1.0 200 OK
        |     Allow: GET, OPTIONS
        |     Date: Mon, 15 Dec 2025 15:39:52 GMT
        |_    Content-Length: 0
        1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
        SF-Port55555-TCP:V=7.94SVN%I=7%D=12/15%Time=69402BC6%P=x86_64-pc-linux-gnu
        SF:%r(GetRequest,A2,"HTTP/1\.0\x20302\x20Found\r\nContent-Type:\x20text/ht
        SF:ml;\x20charset=utf-8\r\nLocation:\x20/web\r\nDate:\x20Mon,\x2015\x20Dec
        SF:\x202025\x2015:39:51\x20GMT\r\nContent-Length:\x2027\r\n\r\n<a\x20href=
        SF:\"/web\">Found</a>\.\n\n")%r(GenericLines,67,"HTTP/1\.1\x20400\x20Bad\x
        SF:20Request\r\nContent-Type:\x20text/plain;\x20charset=utf-8\r\nConnectio
        SF:n:\x20close\r\n\r\n400\x20Bad\x20Request")%r(HTTPOptions,60,"HTTP/1\.0\
        SF:x20200\x20OK\r\nAllow:\x20GET,\x20OPTIONS\r\nDate:\x20Mon,\x2015\x20Dec
        SF:\x202025\x2015:39:52\x20GMT\r\nContent-Length:\x200\r\n\r\n")%r(RTSPReq
        SF:uest,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20text/pl
        SF:ain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\x20Requ
        SF:est")%r(Help,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x2
        SF:0text/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad
        SF:\x20Request")%r(SSLSessionReq,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\
        SF:nContent-Type:\x20text/plain;\x20charset=utf-8\r\nConnection:\x20close\
        SF:r\n\r\n400\x20Bad\x20Request")%r(TerminalServerCookie,67,"HTTP/1\.1\x20
        SF:400\x20Bad\x20Request\r\nContent-Type:\x20text/plain;\x20charset=utf-8\
        SF:r\nConnection:\x20close\r\n\r\n400\x20Bad\x20Request")%r(TLSSessionReq,
        SF:67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20text/plain;\
        SF:x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\x20Request")
        SF:%r(Kerberos,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20
        SF:text/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\
        SF:x20Request")%r(FourOhFourRequest,EA,"HTTP/1\.0\x20400\x20Bad\x20Request
        SF:\r\nContent-Type:\x20text/plain;\x20charset=utf-8\r\nX-Content-Type-Opt
        SF:ions:\x20nosniff\r\nDate:\x20Mon,\x2015\x20Dec\x202025\x2015:40:21\x20G
        SF:MT\r\nContent-Length:\x2075\r\n\r\ninvalid\x20basket\x20name;\x20the\x2
        SF:0name\x20does\x20not\x20match\x20pattern:\x20\^\[\\w\\d\\-_\\\.\]{1,250
        SF:}\$\n")%r(LPDString,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-T
        SF:ype:\x20text/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400
        SF:\x20Bad\x20Request")%r(LDAPSearchReq,67,"HTTP/1\.1\x20400\x20Bad\x20Req
        SF:uest\r\nContent-Type:\x20text/plain;\x20charset=utf-8\r\nConnection:\x2
        SF:0close\r\n\r\n400\x20Bad\x20Request");
        No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
        TCP/IP fingerprint:
        
        Network Distance: 2 hops
        Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
        
        TRACEROUTE (using port 8888/tcp)
        HOP RTT       ADDRESS
        1   188.02 ms 10.10.14.1
        2   188.10 ms 10.129.229.26
        
        OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
        Nmap done: 1 IP address (1 host up) scanned in 122.80 seconds
```

- **Dir**

{{< figure src="image 198.png" >}}

we notice that it is powered by a version

{{< figure src="image 199.png" >}}

{{< figure src="image 200.png" >}}

User creates basket, basket ui now tracks requests to the page created and displays it

- Vulnerability


Public cve exploit

wget [https://raw.githubusercontent.com/entr0pie/CVE-2023-27163/main/CVE-2023-27163.sh](https://raw.githubusercontent.com/entr0pie/CVE-2023-27163/main/CVE-2023-27163.sh)

Will help us forge a SSRF

- Exploitation


{{< figure src="image 201.png" >}}

now on visiting this we are able to view the content of the filtered port 80

{{< figure src="image 202.png" >}}

{{< figure src="image 203.png" >}}

found RCE exploit for this version

Now lets grab the flags

{{< figure src="image 204.png" >}}

{{< figure src="image 205.png" >}}

- Privesc


{{< figure src="image 206.png" >}}

`systemctl status` pipes output to a pager:

- Pager = `less` (by default)
- `less` allows shell escape with `!`
- When run via sudo → **shell runs as root**

So you escalate **from a read-only command** via the pager.

{{< figure src="image 207.png" >}}

{{< figure src="image 208.png" >}}
