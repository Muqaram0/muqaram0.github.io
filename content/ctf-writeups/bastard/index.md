---
title: "Bastard"
date: 2024-07-28
draft: false
description: "HackTheBox Bastard writeup"
tags: ["hackthebox", "htb", "windows", "medium"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Bastard

## Overview

- **OS:** Windows
- **IP:** 10.10.10.9
- **Difficulty:** Medium
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

Exploited site made using drupal , used a exploit that allowed remote code exec , got in and then did priv esc with ms10-59 chimchurri exploit.

## Enumeration


nmap scan results

{{< figure src="image 177.png" >}}

homepage

{{< figure src="image 178.png" >}}

Changelog.txt which is a default drupal file 

{{< figure src="image 179.png" >}}

for some reason dirbuster and gobuster both seem to be acting up with this box , lets try dir search as a final resort

## Vulnerabilities


So for Drupal 7.54 we have the following vulns available 

{{< figure src="image 180.png" >}}

we could go with drupalgeddon2 but it was released in 13th april 2018 , which is much later than the box’s release date 18 March,2017. 

so lets try looking for a exploit before or nearer to that date 

had to search just Drupal this time for a wider list

{{< figure src="image 181.png" >}}

this is probably the intended exploit so lets use this 

2017-03-09

## Exploitation


lets make the following changes to the exploit 

note: make sure to do sudo apt install php-curl before running the script 

{{< figure src="image 182.png" >}}

{{< figure src="image 183.png" >}}

thats strange , oh i forgot to change the rest endpoint as well , gobuster gave us the /rest dir earlier and on visiting it we seem to have activated the endpoint.

lets modify the script now

{{< figure src="image 184.png" >}}

{{< figure src="image 185.png" >}}

{{< figure src="image 186.png" >}}

{{< figure src="image 187.png" >}}

we got our file muq.php uploaded , now lets try for a rev shell

{{< figure src="image 188.png" >}}

{{< figure src="image 189.png" >}}

now time to run the nc

{{< figure src="image 190.png" >}}

and we are in 

{{< figure src="image 191.png" >}}

so systeminfo gives us this

Host Name:                 BASTARD
OS Name:                   Microsoft Windows Server 2008 R2 Datacenter
OS Version:                6.1.7600 N/A Build 7600
OS Manufacturer:           Microsoft Corporation
OS Configuration:          Standalone Server
OS Build Type:             Multiprocessor Free
Registered Owner:          Windows User
Registered Organization:

Product ID:                55041-402-3582622-84461
Original Install Date:     18/3/2017, 7:04:46 ��
System Boot Time:          11/8/2024, 6:06:34 ��
System Manufacturer:       VMware, Inc.
System Model:              VMware Virtual Platform
System Type:               x64-based PC
Processor(s):              2 Processor(s) Installed.
[01]: AMD64 Family 25 Model 1 Stepping 1 AuthenticAMD ~2445 Mhz
[02]: AMD64 Family 25 Model 1 Stepping 1 AuthenticAMD ~2445 Mhz
BIOS Version:              Phoenix Technologies LTD 6.00, 12/11/2020
Windows Directory:         C:\Windows
System Directory:          C:\Windows\system32
Boot Device:               \Device\HarddiskVolume1
System Locale:             el;Greek
Input Locale:              en-us;English (United States)
Time Zone:                 (UTC+02:00) Athens, Bucharest, Istanbul
Total Physical Memory:     2.047 MB
Available Physical Memory: 1.594 MB
Virtual Memory: Max Size:  4.095 MB
Virtual Memory: Available: 3.621 MB
Virtual Memory: In Use:    474 MB
Page File Location(s):     C:\pagefile.sys
Domain:                    HTB
Logon Server:              N/A
Hotfix(s):                 N/A
Network Card(s):           1 NIC(s) Installed.
[01]: Intel(R) PRO/1000 MT Network Connection
Connection Name: Local Area Connection
DHCP Enabled:    No
IP address(es)
[01]: 10.10.10.9

lets use this with our windows exploit suggester and see if we find something sweet

{{< figure src="image 192.png" >}}

lets try using this exploit

{{< figure src="image 193.png" >}}

we will get this on our machine with a python serv nd use it  to get us a rev shell

{{< figure src="image 194.png" >}}

{{< figure src="image 195.png" >}}

and now we grab our flags

{{< figure src="image 196.png" >}}

{{< figure src="image 197.png" >}}
