---
title: "Optimum"
date: 2024-07-28
draft: false
description: "HackTheBox Optimum writeup"
tags: ["hackthebox", "htb", "windows", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Optimum

## Overview

- **OS:** Windows
- **IP:** 10.10.10.8
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

pwned the box with a exploit , used simple http server mainly to host the files for download  and done w metasploit.

## Enumeration


Nmap scan results

{{< figure src="Untitled 125.png" >}}

homepage

{{< figure src="Untitled 126.png" >}}

## Vulnerabilities

[https://www.exploit-db.com/exploits/39161](https://www.exploit-db.com/exploits/39161)

- **Exploitation w/o Metasploit**


lets first get our exploit file

{{< figure src="Untitled 127.png" >}}

now lets check the script nd change our ip to our local one

{{< figure src="Untitled 128.png" >}}

it says we need to be hosting a webserver with netcat , so lets do that

now lets store our netcat here aswell to use alongwith the exploit

{{< figure src="Untitled 129.png" >}}

we make these files available via our simple httpserver

{{< figure src="Untitled 130.png" >}}

setting up our netcat acco. to the port we mentioned earlier 

{{< figure src="Untitled 131.png" >}}

now on running this 2 or 3 times

python [39161.py](http://39161.py) 10.10.10.8 80

we are able to get our shell

{{< figure src="Untitled 132.png" >}}

we got our user flag

{{< figure src="Untitled 133.png" >}}

{{< figure src="Untitled 134.png" >}}

we might need to do some privilege escalation for the root flag

lets check the systems info.

Host Name:                 OPTIMUM
OS Name:                   Microsoft Windows Server 2012 R2 Standard
OS Version:                6.3.9600 N/A Build 9600
OS Manufacturer:           Microsoft Corporation
OS Configuration:          Standalone Server
OS Build Type:             Multiprocessor Free
Registered Owner:          Windows User
Registered Organization:

Product ID:                00252-70000-00000-AA535
Original Install Date:     18/3/2017, 1:51:36 ��
System Boot Time:          9/8/2024, 3:17:56 ��
System Manufacturer:       VMware, Inc.
System Model:              VMware Virtual Platform
System Type:               x64-based PC
Processor(s):              1 Processor(s) Installed.
[01]: AMD64 Family 25 Model 1 Stepping 1 AuthenticAMD ~2445 Mhz
BIOS Version:              Phoenix Technologies LTD 6.00, 12/11/2020
Windows Directory:         C:\Windows
System Directory:          C:\Windows\system32
Boot Device:               \Device\HarddiskVolume1
System Locale:             el;Greek
Input Locale:              en-us;English (United States)
Time Zone:                 (UTC+02:00) Athens, Bucharest
Total Physical Memory:     4.095 MB
Available Physical Memory: 3.527 MB
Virtual Memory: Max Size:  5.503 MB
Virtual Memory: Available: 4.971 MB
Virtual Memory: In Use:    532 MB
Page File Location(s):     C:\pagefile.sys
Domain:                    HTB
Logon Server:              \\OPTIMUM
Hotfix(s):                 31 Hotfix(s) Installed.
[01]: KB2959936
[02]: KB2896496
[03]: KB2919355
[04]: KB2920189
[05]: KB2928120
[06]: KB2931358
[07]: KB2931366
[08]: KB2933826
[09]: KB2938772
[10]: KB2949621
[11]: KB2954879
[12]: KB2958262
[13]: KB2958263
[14]: KB2961072
[15]: KB2965500
[16]: KB2966407
[17]: KB2967917
[18]: KB2971203
[19]: KB2971850
[20]: KB2973351
[21]: KB2973448
[22]: KB2975061
[23]: KB2976627
[24]: KB2977629
[25]: KB2981580
[26]: KB2987107
[27]: KB2989647
[28]: KB2998527
[29]: KB3000850
[30]: KB3003057
[31]: KB3014442
Network Card(s):           1 NIC(s) Installed.
[01]: Intel(R) 82574L Gigabit Network Connection
Connection Name: Ethernet0
DHCP Enabled:    No
IP address(es)
[01]: 10.10.10.8
Hyper-V Requirements:      A hypervisor has been detected. Features required for Hyper-V will not be displayed.

running the local windows exploit suggester

{{< figure src="Untitled 135.png" >}}

we will use this one

{{< figure src="Untitled 136.png" >}}

now lets host it and download it on to our victims machine

{{< figure src="Untitled 137.png" >}}

{{< figure src="Untitled 138.png" >}}

getting the root flag

{{< figure src="Untitled 139.png" >}}

- **Exploitation w Metasploit**

{{< figure src="Untitled 140.png" >}}

and we are in 

we got our user flag

{{< figure src="Untitled 141.png" >}}

time to do some privilege escalation for the root flag

we will first run the local exploit suggester

{{< figure src="Untitled 142.png" >}}

{{< figure src="Untitled 143.png" >}}

aand now we have a bunch of exploits to choose from , lets go with the last one

{{< figure src="Untitled 144.png" >}}
