---
title: "Legacyq"
date: 2024-07-17
draft: false
description: "HackTheBox Legacyq writeup"
tags: ["hackthebox", "htb", "windows", "easy"]
categories: ["CTF Writeups"]
showTableOfContents: true
showReadingTime: true
showWordCount: true
---

# Legacyq

## Overview

- **OS:** Windows
- **IP:** 10.10.10.4
- **Difficulty:** Easy
- **Platform:** HackTheBox
- **OSCP:** No
- **Lists:** N/A

### Summary

smb vulnerability.

## Enumeration


I started broad, validated each finding, and then focused only on paths that were reproducible.

nmap scan results

{{< figure src="Untitled 1.png" >}}

Checking for existing smb vulnerabilities

{{< figure src="Untitled 2.png" >}}

## Vulnerabilities


I validated this step using the evidence below before moving forward in the chain.

PORT 445/tcp

{{< figure src="Untitled 3.png" >}}

## Exploitation


Once the primitive was confirmed, I converted it into a stable foothold and chained it forward.

{{< figure src="Untitled 4.png" >}}

{{< figure src="Untitled 5.png" >}}

gained access to the shell, now lets look for the flags

**root flag**

{{< figure src="Untitled 6.png" >}}

**user flag**

{{< figure src="Untitled 7.png" >}}

**Pwned**
