---
title: "Arctic"
date: 2024-07-28
draft: false
description: "HackTheBox Arctic writeup"
tags: ["hackthebox", "htb", "windows", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Arctic

## Overview

- **OS:** Windows
- **IP:** 10.10.10.11
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

used a local exploit  , certutil and hashcat done w/o ms.

## Enumeration


nmap scan results

{{< figure src="Untitled 8.png" >}}

homepage

{{< figure src="Untitled 9.png" >}}

we find the admin page

{{< figure src="Untitled 10.png" >}}

## Vulnerabilities


ok so they are using CFIDE . lets look up a exploit for this

[https://www.exploit-db.com/exploits/50057](https://www.exploit-db.com/exploits/50057)

Directory traversal exploit

[https://www.exploit-db.com/exploits/14641](https://www.exploit-db.com/exploits/14641)

## Exploitation
- **without metasploit**

lets use the 2010 directory traversal exploit

{{< figure src="Untitled 11.png" >}}

lets visit the directory specified 

{{< figure src="Untitled 12.png" >}}

ok so with this we have the password but its encrypted using a hash value ,

lets  identify the hash first

{{< figure src="Untitled 13.png" >}}

{{< figure src="Untitled 14.png" >}}

hmm alright , lets use hashcat now

{{< figure src="Untitled 15.png" >}}

{{< figure src="Untitled 16.png" >}}

and there we go , we got the password , now lets access the admin page

we find this scheduled task page , where we can possibly upload our payload

{{< figure src="Untitled 17.png" >}}

lets create a jsp payload with msfvenom and upload it

{{< figure src="Untitled 18.png" >}}

{{< figure src="Untitled 19.png" >}}

starting a simple server

{{< figure src="Untitled 20.png" >}}

now lets grab our file

{{< figure src="Untitled 21.png" >}}

{{< figure src="Untitled 22.png" >}}

on visiting index we find this

{{< figure src="Untitled 23.png" >}}

and there we go  we got our shell . now time for some privilege escalation soon 

{{< figure src="Untitled 24.png" >}}

this is our systems information

Host Name:                 ARCTIC
OS Name:                   Microsoft Windows Server 2008 R2 Standard
OS Version:                6.1.7600 N/A Build 7600
OS Manufacturer:           Microsoft Corporation
OS Configuration:          Standalone Server
OS Build Type:             Multiprocessor Free
Registered Owner:          Windows User
Registered Organization:

Product ID:                55041-507-9857321-84451
Original Install Date:     22/3/2017, 11:09:45 ��
System Boot Time:          6/8/2024, 6:24:51 ��
System Manufacturer:       VMware, Inc.
System Model:              VMware Virtual Platform
System Type:               x64-based PC
Processor(s):              1 Processor(s) Installed.
[01]: AMD64 Family 25 Model 1 Stepping 1 AuthenticAMD ~2595 Mhz
BIOS Version:              Phoenix Technologies LTD 6.00, 12/11/2020
Windows Directory:         C:\Windows
System Directory:          C:\Windows\system32
Boot Device:               \Device\HarddiskVolume1
System Locale:             el;Greek
Input Locale:              en-us;English (United States)
Time Zone:                 (UTC+02:00) Athens, Bucharest, Istanbul
Total Physical Memory:     6.143 MB
Available Physical Memory: 5.097 MB
Virtual Memory: Max Size:  12.285 MB
Virtual Memory: Available: 11.288 MB
Virtual Memory: In Use:    997 MB
Page File Location(s):     C:\pagefile.sys
Domain:                    HTB
Logon Server:              N/A
Hotfix(s):                 N/A
Network Card(s):

1 NIC(s) Installed.
[01]: Intel(R) PRO/1000 MT Network Connection
Connection Name: Local Area Connection
DHCP Enabled:    No
IP address(es)
[01]: 10.10.10.11

lets put this in a local windows exploit suggester 

{{< figure src="Untitled 25.png" >}}

lets use ms10-059

{{< figure src="Untitled 26.png" >}}

we will upload this with simple serv nd execute on the targets machine

{{< figure src="Untitled 27.png" >}}

lets execute it now

{{< figure src="Untitled 28.png" >}}

ok lts get out upgraded shell now

{{< figure src="Untitled 29.png" >}}

and now e can grab our flags

{{< figure src="Untitled 30.png" >}}

root flag

{{< figure src="Untitled 31.png" >}}

user flag

{{< figure src="Untitled 32.png" >}}
