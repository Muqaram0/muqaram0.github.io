---
title: "Blue"
date: 2024-07-17
draft: false
description: "HackTheBox Blue writeup"
tags: ["hackthebox", "htb", "windows", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Blue

## Overview

- **OS:** Windows
- **IP:** 10.10.10.40
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

smb 2.1.0 vulnerability / Eternal Blue.

## Enumeration

I started broad, validated each finding, and then focused only on paths that were reproducible.

nmap scan results

{{< figure src="Untitled 118.png" >}}

{{< figure src="Untitled 119.png" >}}

## Vulnerabilities


**port 445 / tcp**

smb 2.1.0 windows 7 

[https://www.rapid7.com/db/modules/exploit/windows/smb/ms17_010_eternalblue/](https://www.rapid7.com/db/modules/exploit/windows/smb/ms17_010_eternalblue/) 

## Exploitation


using the smb 2.1.0 vulnerability eternal blue that we found earlier

{{< figure src="Untitled 120.png" >}}

{{< figure src="Untitled 121.png" >}}

{{< figure src="Untitled 122.png" >}}

we got in , now time to grab our flags

{{< figure src="Untitled 123.png" >}}

{{< figure src="Untitled 124.png" >}}

**pwned**
