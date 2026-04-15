---
title: "Lame"
date: 2024-07-17
draft: false
description: "HackTheBox Lame writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Lame

## Overview

- **OS:** Linux
- **IP:** 10.10.10.3
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

vsftpd-234 backdoor exploit.

## Enumeration


I started broad, validated each finding, and then focused only on paths that were reproducible.

nmap scan results

{{< figure src="Untitled 170.png" >}}

{{< figure src="Untitled 171.png" >}}

## Vulnerabilities


**PORT 21/tcp**

vsftpd 2.3.4 backdoor

[https://www.rapid7.com/db/modules/exploit/unix/ftp/vsftpd_234_backdoor/](https://www.rapid7.com/db/modules/exploit/unix/ftp/vsftpd_234_backdoor/)

**PORT 445/tcp** 

samba smbd 3.0.20-Debian

**CVE-2007-2447** **25rc3**
 allows remote attackers to execute arbitrary commands via shell 
metacharacters involving the (1) SamrChangePassword function, when the 
"username map script" smb.

## Exploitation


Using metasploit to execute the backdoor attack

{{< figure src="Untitled 172.png" >}}

{{< figure src="Untitled 173.png" >}}

So apparently , the backdoor exploit does not work we will now try to another vulnerability that we had found

{{< figure src="Untitled 174.png" >}}

the samba exploit works , now time to grab our flags

{{< figure src="Untitled 175.png" >}}

{{< figure src="Untitled 176.png" >}}

pwned
