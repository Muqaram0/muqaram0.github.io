---
title: "Shocker"
date: 2024-07-17
draft: false
description: "HackTheBox Shocker writeup"
tags: ["hackthebox", "htb", "linux", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Shocker

## Overview

- **OS:** Linux
- **IP:** 10.10.10.56
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

cgi-bin/user.sh shellshock exploit + perl.

## Enumeration


I started broad, validated each finding, and then focused only on paths that were reproducible.

**nmap scan results**

{{< figure src="Untitled 92.png" >}}

**Directory busting results**

/

/cgi-bin/  → user.sh

/icons/

/icons/small/

{{< figure src="Untitled 93.png" >}}

Could possibly run a script here?

{{< figure src="Untitled 94.png" >}}

## Vulnerabilities


**PORT 40/TCP**

logrotate

[https://www.exploit-db.com/exploits/46676](https://www.exploit-db.com/exploits/46676)

**PORT 2222/TCP**

username enumeration

[https://www.exploit-db.com/exploits/40136](https://www.exploit-db.com/exploits/40136)

**DRIECTORY** 

**/cgi-bin/user.sh**

Shellshock

## Exploitation


Exploiting using the shellshock vulnerability

{{< figure src="Untitled 95.png" >}}

Now lets grab our flags, starting with the user flag

{{< figure src="Untitled 96.png" >}}

not able to access root directory , probably because we have a lower privilege

{{< figure src="Untitled 97.png" >}}

**Privilege escalation**

{{< figure src="Untitled 98.png" >}}

{{< figure src="Untitled 99.png" >}}

{{< figure src="Untitled 100.png" >}}

and here we have the root flag as well

{{< figure src="Untitled 101.png" >}}

**pwned**
