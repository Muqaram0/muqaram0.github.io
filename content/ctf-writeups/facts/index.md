---
title: "Facts"
date: 2026-03-10
draft: false
description: "HackTheBox Facts writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Facts

## Overview

- **OS:** Linux
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

season.

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
└─$ nmap -sCV -A --min-rate=20000 facts.htb               
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-10 06:52 EDT
Nmap scan report for facts.htb (10.129.4.247)
Host is up (0.10s latency).
Not shown: 998 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 9.9p1 Ubuntu 3ubuntu3.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 4d:d7:b2:8c:d4:df:57:9c:a4:2f:df:c6:e3:01:29:89 (ECDSA)
|_  256 a3:ad:6b:2f:4a:bf:6f:48:ac:81:b9:45:3f:de:fb:87 (ED25519)
**80/tcp open  http    nginx 1.26.3 (Ubuntu)**
|_http-server-header: nginx/1.26.3 (Ubuntu)
|_http-title: facts
Device type: general purpose|router
Running: Linux 5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 5.0 - 5.14, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 23/tcp)
HOP RTT       ADDRESS
1   114.91 ms 10.10.14.1
2   115.04 ms facts.htb (10.129.4.247)

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 20.99 seconds

nmap -sCV -A -p- -min-rate=20000 facts.htb
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-10 07:21 EDT
Warning: 10.129.4.247 giving up on port because retransmission cap hit (10).
Nmap scan report for facts.htb (10.129.4.247)
Host is up (0.12s latency).
Not shown: 65532 closed tcp ports (reset)
PORT      STATE SERVICE VERSION
22/tcp    open  ssh     OpenSSH 9.9p1 Ubuntu 3ubuntu3.2 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 4d:d7:b2:8c:d4:df:57:9c:a4:2f:df:c6:e3:01:29:89 (ECDSA)
|_  256 a3:ad:6b:2f:4a:bf:6f:48:ac:81:b9:45:3f:de:fb:87 (ED25519)
80/tcp    open  http    nginx 1.26.3 (Ubuntu)
|_http-server-header: nginx/1.26.3 (Ubuntu)
|_http-title: facts
54321/tcp open  http    Golang net/http server
|_http-title: Did not follow redirect to http://facts.htb:9001
|_http-server-header: MinIO
| fingerprint-strings: 
|   FourOhFourRequest: 
|     HTTP/1.0 400 Bad Request
|     Accept-Ranges: bytes
|     Content-Length: 303
|     Content-Type: application/xml
|     Server: MinIO
|     Strict-Transport-Security: max-age=31536000; includeSubDomains
|     Vary: Origin
|     X-Amz-Id-2: dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8
|     X-Amz-Request-Id: 189B770345D0671F
|     X-Content-Type-Options: nosniff
|     X-Xss-Protection: 1; mode=block
|     Date: Tue, 10 Mar 2026 11:22:14 GMT
|     <?xml version="1.0" encoding="UTF-8"?>
|     <Error><Code>InvalidRequest</Code><Message>Invalid Request (invalid argument)</Message><Resource>/nice ports,/Trinity.txt.bak</Resource><RequestId>189B770345D0671F</RequestId><HostId>dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8</HostId></Error>
|   GenericLines, Help, RTSPRequest, SSLSessionReq: 
|     HTTP/1.1 400 Bad Request
|     Content-Type: text/plain; charset=utf-8
|     Connection: close
|     Request
|   GetRequest: 
|     HTTP/1.0 400 Bad Request
|     Accept-Ranges: bytes
|     Content-Length: 276
|     Content-Type: application/xml
|     Server: MinIO
|     Strict-Transport-Security: max-age=31536000; includeSubDomains
|     Vary: Origin
|     X-Amz-Id-2: dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8
|     X-Amz-Request-Id: 189B76FF6775CEB9
|     X-Content-Type-Options: nosniff
|     X-Xss-Protection: 1; mode=block
|     Date: Tue, 10 Mar 2026 11:21:57 GMT
|     <?xml version="1.0" encoding="UTF-8"?>
|     <Error><Code>InvalidRequest</Code><Message>Invalid Request (invalid argument)</Message><Resource>/</Resource><RequestId>189B76FF6775CEB9</RequestId><HostId>dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8</HostId></Error>
|   HTTPOptions: 
|     HTTP/1.0 200 OK
|     Vary: Origin
|     Date: Tue, 10 Mar 2026 11:21:57 GMT
|_    Content-Length: 0
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerprint at https://nmap.org/cgi-bin/submit.cgi?new-service :
SF-Port54321-TCP:V=7.95%I=7%D=3/10%Time=69AFFED5%P=x86_64-pc-linux-gnu%r(G
SF:enericLines,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20
SF:text/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\
SF:x20Request")%r(GetRequest,2B0,"HTTP/1\.0\x20400\x20Bad\x20Request\r\nAc
SF:cept-Ranges:\x20bytes\r\nContent-Length:\x20276\r\nContent-Type:\x20app
SF:lication/xml\r\nServer:\x20MinIO\r\nStrict-Transport-Security:\x20max-a
SF:ge=31536000;\x20includeSubDomains\r\nVary:\x20Origin\r\nX-Amz-Id-2:\x20
SF:dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af9251148b658df7ac2e3e8\r\nX-A
SF:mz-Request-Id:\x20189B76FF6775CEB9\r\nX-Content-Type-Options:\x20nosnif
SF:f\r\nX-Xss-Protection:\x201;\x20mode=block\r\nDate:\x20Tue,\x2010\x20Ma
SF:r\x202026\x2011:21:57\x20GMT\r\n\r\n<\?xml\x20version=\"1\.0\"\x20encod
SF:ing=\"UTF-8\"\?>\n<Error><Code>InvalidRequest</Code><Message>Invalid\x2
SF:0Request\x20\(invalid\x20argument\)</Message><Resource>/</Resource><Req
SF:uestId>189B76FF6775CEB9</RequestId><HostId>dd9025bab4ad464b049177c95eb6
SF:ebf374d3b3fd1af9251148b658df7ac2e3e8</HostId></Error>")%r(HTTPOptions,5
SF:9,"HTTP/1\.0\x20200\x20OK\r\nVary:\x20Origin\r\nDate:\x20Tue,\x2010\x20
SF:Mar\x202026\x2011:21:57\x20GMT\r\nContent-Length:\x200\r\n\r\n")%r(RTSP
SF:Request,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:\x20text
SF:/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20Bad\x20R
SF:equest")%r(Help,67,"HTTP/1\.1\x20400\x20Bad\x20Request\r\nContent-Type:
SF:\x20text/plain;\x20charset=utf-8\r\nConnection:\x20close\r\n\r\n400\x20
SF:Bad\x20Request")%r(SSLSessionReq,67,"HTTP/1\.1\x20400\x20Bad\x20Request
SF:\r\nContent-Type:\x20text/plain;\x20charset=utf-8\r\nConnection:\x20clo
SF:se\r\n\r\n400\x20Bad\x20Request")%r(FourOhFourRequest,2CB,"HTTP/1\.0\x2
SF:0400\x20Bad\x20Request\r\nAccept-Ranges:\x20bytes\r\nContent-Length:\x2
SF:0303\r\nContent-Type:\x20application/xml\r\nServer:\x20MinIO\r\nStrict-
SF:Transport-Security:\x20max-age=31536000;\x20includeSubDomains\r\nVary:\
SF:x20Origin\r\nX-Amz-Id-2:\x20dd9025bab4ad464b049177c95eb6ebf374d3b3fd1af
SF:9251148b658df7ac2e3e8\r\nX-Amz-Request-Id:\x20189B770345D0671F\r\nX-Con
SF:tent-Type-Options:\x20nosniff\r\nX-Xss-Protection:\x201;\x20mode=block\
SF:r\nDate:\x20Tue,\x2010\x20Mar\x202026\x2011:22:14\x20GMT\r\n\r\n<\?xml\
SF:x20version=\"1\.0\"\x20encoding=\"UTF-8\"\?>\n<Error><Code>InvalidReque
SF:st</Code><Message>Invalid\x20Request\x20\(invalid\x20argument\)</Messag
SF:e><Resource>/nice\x20ports,/Trinity\.txt\.bak</Resource><RequestId>189B
SF:770345D0671F</RequestId><HostId>dd9025bab4ad464b049177c95eb6ebf374d3b3f
SF:d1af9251148b658df7ac2e3e8</HostId></Error>");
Device type: general purpose|router
Running: Linux 5.X, MikroTik RouterOS 7.X
OS CPE: cpe:/o:linux:linux_kernel:5 cpe:/o:mikrotik:routeros:7 cpe:/o:linux:linux_kernel:5.6.3
OS details: Linux 5.0 - 5.14, MikroTik RouterOS 7.2 - 7.5 (Linux 5.6.3)
Network Distance: 2 hops
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

TRACEROUTE (using port 5900/tcp)
HOP RTT       ADDRESS
1   114.28 ms 10.10.14.1
2   114.52 ms facts.htb (10.129.4.247)

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 41.57 seconds

```

## Dirbusting

```

```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 595.png" >}}

{{< figure src="image 596.png" >}}

{{< figure src="image 597.png" >}}

{{< figure src="image 598.png" >}}

## Exploitation

lets look at Camaleon CMS 

if the key exits in the database users table has role:string attacker can send password[role]=admin and thr rails sees @user.role = “admin”

{{< figure src="image 599.png" >}}

{{< figure src="image 600.png" >}}

now we have admin

{{< figure src="image 601.png" >}}

{{< figure src="image 602.png" >}}

{{< figure src="image 603.png" >}}

AKIAA042540D4E8C3E8E

Zf5bIMiltmLF2ux1JZyX3Gs3MasRtlwcAolHc7em

lets use these creds with the AWS CLI and enumerate all the s3 buckets

```
┌──(kali㉿kali)-[~/Desktop/vpn]
└─$ aws --endpoint-url http://facts.htb:54321 s3 ls s3://internal/
                           PRE .bundle/
                           PRE .cache/
                           PRE .ssh/
2026-01-08 13:45:13        220 .bash_logout
2026-01-08 13:45:13       3900 .bashrc
2026-01-08 13:47:17         20 .lesshst
2026-01-08 13:47:17        807 .profile
                                                                                                                                                            
┌──(kali㉿kali)-[~/Desktop/vpn]
└─$ aws --endpoint-url http://facts.htb:54321 s3 ls s3://randomfacts/
                           PRE thumb/
2025-09-11 08:07:06     446847 animalejected.png
2025-09-11 08:07:06     271210 annefrankasteroid.png
2025-09-11 08:07:06     255778 catsattachment.png
2025-09-11 08:07:05     411597 cuteanimals.png
2025-09-11 08:07:05     177331 darkchocolate.png
2025-09-11 08:07:05     312753 dogscatssmell.png
2025-09-11 08:07:04     922561 dolphinfact.png
2025-09-11 08:07:04      67352 finlandhappiest.png
2025-09-11 08:07:04     388178 firstimpressions.png
2025-09-11 08:07:04     100689 firsttransaction.png
2025-09-11 08:07:03     222436 firstwebcam.png
2025-09-11 08:07:03     128158 georgewashingtonslaves.png
2025-09-11 08:07:03      34816 logopage.png
2025-09-11 08:07:03      16886 logopage2.png
2025-09-11 08:07:02      80796 pressureupbeat.png
2025-09-11 08:07:02      24792 primary-question-mark.png
2025-09-11 08:07:02     341284 smallanimals.png
2025-09-11 08:07:02     332397 superiorpeople.png
2025-09-11 08:07:01      39579 vanilla.png
2025-09-11 08:07:01      35769 youtubewatchhours.png
                                                          
```

and using a exploit we found online we enumerated the etc/passwd file to find a user called trivia who apparently owns this ssh key 

loggin after cracking the key with john to get the pass as dragonballz

we get the user flag

sudo -l shows we can execute a binary called facts as sudo, and we exploit that thru gtfobins

{{< figure src="image 604.png" >}}
